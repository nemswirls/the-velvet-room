#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session, make_response, render_template, redirect, url_for
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Player, Arcana, Compendium, Persona, Stock, Wildcard, Special_Material
import random

# Views go here!

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.before_request
def check_if_logged_in():
    if not session.get('player_id'):
        return {'error': 'Unauthorized, please log in first'}, 401

class ClearSession(Resource):
    def delete(self):
        session['player_id'] = None  # Clear the player session
        return {}, 204  # Return an empty response with status code 204 (No Content)
    
class Signup(Resource):
    def post(self):
        try:
            json = request.get_json()

            # Check if the username already exists in the database
            existing_user = Player.query.filter_by(username=json['username']).first()

            error_dict = {}

            if existing_user:
                error_dict['username'] = 'Username already taken.'

            if existing_user:
                return {'error': error_dict}, 400
            player = Player(
                username=json['username'],
                password_hash=json['password']  # Assuming you're hashing the password
            )

            db.session.add(player)
            db.session.commit()

            # After creating the player, return a message saying they can now choose a wildcard
            return {'message': 'Player created successfully, now choose your wildcard.'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500
class CheckSession(Resource):

    def get(self):
        
        player_id = session.get('player_id', 0)
        if player_id:
            user = Player.query.filter(Player.id == player_id).first()
            return user.to_dict(), 200
        
        return {}, 204

class Login(Resource):
    def post(self):
        try:
            json = request.get_json()

            username = json['username']
            player = Player.query.filter_by(username=username).first()

            if not player or not player.authenticate(json['password']):
                return {'error': 'Invalid username or password'}, 401

            session['player_id'] = player.id  # Store player ID in the session
            return player.to_dict(), 200
        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}, 500

class Logout(Resource):
    def delete(self):
        session['player_id'] = None
        return {}, 204

class ChooseWildcardById(Resource):
    def post(self):
        try:
            json = request.get_json()

            # Get the player_id from the session
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            # Fetch player data from the database
            player = Player.query.filter(Player.id == player_id).first()
            if not player:
                return {'error': 'Player not found'}, 404

            # Get the wildcard_id from the request
            wildcard_id = json.get('wildcard_id')
            if not wildcard_id:
                return {'error': 'Wildcard ID is required'}, 400

            # Fetch the wildcard data from the database
            wildcard = Wildcard.query.filter(Wildcard.id == wildcard_id).first()
            if not wildcard:
                return {'error': 'Invalid wildcard ID'}, 400

            # Optionally, check if the player has already chosen a wildcard
            if player.wildcard:
                return {'error': 'You have already chosen a wildcard'}, 400

            # Assign the chosen wildcard to the player
            player.wildcard = wildcard

            # Assign the initial persona to the player's stock based on their wildcard
            initial_persona = Persona.query.filter(Persona.wildcard_id == wildcard.id).first()  # Adjust the field if necessary
            if initial_persona:
                # Add the initial persona to the player's stock (assuming the player has a stock table)
                new_stock = Stock(player_id=player.id, persona_id=initial_persona.id)
                db.session.add(new_stock)

            # Commit all changes to the database
            db.session.commit()

            # Return the updated player profile with the chosen wildcard and initial persona
            return {'message': 'Wildcard chosen successfully', 'player': player.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

class PersonaByID(Resource):   
    def get(self, persona_id):
        # Retrieve a specific persona by ID
        persona = Persona.query.get(persona_id)
        if not persona:
            return {'error': 'Persona not found'}, 404
        return persona.to_dict(), 200
    
class SummonPersona(Resource):
    def post(self):
        try:
            # Get player_id from session
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            # Fetch player from database
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            # Check if player's stock is full
            if len(player.stock) >= player.stock_limit:
                return {'error': 'You have reached your stock limit.'}, 400

            # Check if player has enough yen (assuming 200 yen per summon)
            if player.yen < 200:
                return {'error': 'Not enough yen.'}, 400

            # Determine level range based on player level (e.g., ±5 levels)
            min_level = max(1, player.level - 5)  # Ensure level is not less than 1
            max_level = player.level + 5

            # Query the personas table for personas within this level range
            eligible_personas = Persona.query.filter(Persona.level >= min_level, Persona.level <= max_level).all()

            if not eligible_personas:
                return {'error': 'No personas available for your level range.'}, 404

            # Randomly select a persona from eligible personas
            selected_persona = random.choice(eligible_personas)

            # Deduct yen from player
            player.yen -= 200
            db.session.commit()

            # Add the selected persona to player's stock
            new_stock = Stock(player_id=player_id, persona_id=selected_persona.id)
            db.session.add(new_stock)
            db.session.commit()

            # Increment player level by 1 and give yen for leveling up
            player.level += 1
            player.yen += 100  # 100 yen per level up
            db.session.commit()
            
            # Update stock limit based on the new level
            player.update_stock_limit()

            return jsonify(selected_persona.to_dict()), 201

        except Exception as e:
            db.session.rollback()  # Rollback on error
            return {'error': f'An error occurred: {str(e)}'}, 500

class Wildcards(Resource):
    def get(self, wildcard_id=None):
        if wildcard_id:  # If an ID is provided, retrieve that specific wildcard
            wildcard = Wildcard.query.get(wildcard_id)
            if not wildcard:
                return {'error': 'Wildcard not found'}, 404
            return wildcard.to_dict(), 200
        else:  # If no ID is provided, return all wildcards
            wildcards = Wildcard.query.all()
            return make_response(jsonify([wildcard.to_dict() for wildcard in wildcards]), 200)

class Compendiums(Resource):
    def get(self):
        # Return all available personas in the compendium (those that have been summoned before)
        compendium_personas = Compendium.query.all()  # Using the Compendium table
        return make_response(jsonify([persona.to_dict() for persona in compendium_personas]), 200)

    def post(self):
        try:
            json = request.get_json()
            player_id = session.get('player_id')  # Ensure the player is logged in
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            # Retrieve the persona the player wants to buy
            persona = Persona.query.get(json['persona_id'])
            if not persona:
                return {'error': 'Persona not found'}, 404

            # Ensure the persona is in the compendium (based on the Compendium table)
            if not Compendium.query.filter_by(persona_id=persona.id).first():  # Adjusted to check the Compendium table
                return {'error': 'Persona not available in the compendium'}, 400

            # Ensure the player doesn't already have this persona in their stock
            if Stock.query.filter_by(player_id=player_id, persona_id=persona.id).first():
                return {'error': 'Persona is already in your stock'}, 400

            # Check if the player has enough yen
            if player.yen < persona.price:
                return {'error': 'Not enough yen'}, 400

            # Deduct yen and add the persona to the stock
            player.yen -= persona.price
            new_stock = Stock(player_id=player_id, persona_id=persona.id)
            db.session.add(new_stock)

            # Optionally, add the persona to the compendium if it hasn't been added before
            if not Compendium.query.filter_by(persona_id=persona.id).first():  # Adjusted to check the Compendium table
                new_compendium_entry = Compendium(persona_id=persona.id)  # Assuming the Compendium table has a persona_id column
                db.session.add(new_compendium_entry)

            db.session.commit()

            return persona.to_dict(), 201

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

class ReleasePersonaById(Resource):
    def delete(self):
        try:
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            # Fetch the player and their stock of personas
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            persona_id = json.get('persona_id')
            stock_entry = Stock.query.filter_by(player_id=player_id, persona_id=persona_id).first()

            if not stock_entry:
                return {'error': 'Persona not found in your stock'}, 404

            # Get the persona's level to calculate yen reward
            persona = Persona.query.get(persona_id)
            if not persona:
                return {'error': 'Persona not found'}, 404

            # Calculate yen reward based on persona's level
            yen_reward = persona.level * 100  # For example, 100 yen per level of the persona

            # Remove the persona from the player's stock
            db.session.delete(stock_entry)
            db.session.commit()

            # Add yen reward to player
            player.yen += yen_reward
            db.session.commit()

            return {'message': f'Persona released, earned {yen_reward} yen.'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

class ArcanaById(Resource):
    def get(self, arcana_id):
        # Retrieve a specific arcana by ID
        arcana = Arcana.query.get(arcana_id)
        if not arcana:
            return {'error': 'Arcana not found'}, 404
        return arcana.to_dict(), 200

class Fusion(Resource):
    def post(self):
        try:
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            json = request.get_json()
            persona_1_id = json.get('persona_1_id')
            persona_2_id = json.get('persona_2_id')

            persona_1 = Persona.query.get(persona_1_id)
            persona_2 = Persona.query.get(persona_2_id)

            if not persona_1 or not persona_2:
                return {'error': 'Invalid persona(s) selected'}, 400

            # Ensure player has both personas in their stock
            if not any(stock.persona_id == persona_1.id for stock in player.stock) or \
               not any(stock.persona_id == persona_2.id for stock in player.stock):
                return {'error': 'You must have both personas in your stock to fuse them.'}, 400

            # Get fusion result from the arcana mapping
            fusion_result = arcana_mapping.get((persona_1.arcana_id, persona_2.arcana_id))

            if not fusion_result:
                return {'error': 'These personas cannot be fused together.'}, 400

            resulting_persona = Persona.query.get(fusion_result)
            if not resulting_persona:
                return {'error': 'Fusion result persona not found'}, 404

            # Check if the player's level is sufficient for the fusion
            if player.level < resulting_persona.required_level:
                return {'error': f'You need to be level {resulting_persona.required_level} to fuse this persona.'}, 400

            # Remove the fused personas from stock
            Stock.query.filter(Stock.player_id == player_id, Stock.persona_id == persona_1.id).delete()
            Stock.query.filter(Stock.player_id == player_id, Stock.persona_id == persona_2.id).delete()

            # Add the resulting persona to stock
            new_stock = Stock(player_id=player_id, persona_id=resulting_persona.id)
            db.session.add(new_stock)

            # Level up the player and give yen based on level increase
            level_up_amount = 3  # or 5 depending on your logic
            player.level += level_up_amount
            player.yen += level_up_amount * 100  # 100 yen per level up

            # Update stock limit based on the new level
            player.update_stock_limit()

            db.session.commit()

            return jsonify(resulting_persona.to_dict()), 201

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

class UpdatePlayerProfile(Resource):
    def patch(self):
        try:
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            # Update only fields that are provided in the request
            if 'password' in json:
                player.password_hash = json['password']
            if 'username' in json:
                player.username = json['username']

            db.session.commit()

            return player.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

api.add_resource(ClearSession, '/api/clear', endpoint='clear')
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(CheckSession, '/api/check-session', endpoint='check_session')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(ChooseWildcardById, '/api/choose-wildcard/<int:wildcard_id>', endpoint='choose_wildcard_by_id')
api.add_resource(PersonaByID, '/api/personas/<int:persona_id>', endpoint='persona_by_id')
api.add_resource(SummonPersona, '/api/summon-persona', endpoint='summon_persona')
api.add_resource(Wildcards, '/api/wildcards', endpoint='wildcards')
api.add_resource(Compendiums, '/api/compendiums', endpoint='compendiums')
api.add_resource(ReleasePersonaById, '/api/release-persona', endpoint='release_persona')
api.add_resource(ArcanaById, '/api/arcanas/<int:arcana_id>', endpoint='arcana_by_id')
api.add_resource(Fusion, '/api/fusion', endpoint='fusion')
api.add_resource(UpdatePlayerProfile, '/api/update-player-profile', endpoint='update_player_profile')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


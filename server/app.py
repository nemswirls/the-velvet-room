#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Player, Arcana, Compendium, Persona, Stock, Wildcard, Special_Material
from utilities import arcana_map 
import random

# Views go here!

@app.route('/')
def index():
    return app.send_static_file('index.html')

# @app.before_request
# def check_if_logged_in():
#     openaccess= ["signup", "login", "check-session"]
#     if not session.get('player_id') and not request.endpoint in openaccess:
#         return {'error': 'Unauthorized, please log in first'}, 401

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
            session['player_id'] = player.id  # Store player ID in the session
            return make_response(player.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500
class CheckSession(Resource):
    def get(self):
        player_id = session.get('player_id')

        if player_id:
            # Check if player exists in the database
            player = Player.query.filter(Player.id == player_id).first()
            if player:
                # If player is found, return player data
                return player.to_dict(only=("username", "wildcard", "personas", "level", "yen", "stock_limit")), 200
        
        # Return an error if player_id is not in session or player doesn't exist
        return {'error': 'Unauthorized, please log in first'}, 401

class Login(Resource):
    def post(self):
        try:
            json = request.get_json()

            username = json['username']
            player = Player.query.filter_by(username=username).first()

            if not player or not player.authenticate(json['password']):
                return {'error': 'Invalid username or password'}, 401

            session['player_id'] = player.id  # Store player ID in the session
            return player.to_dict(only=("username","wildcard","personas","level", "yen", "stock_limit",)), 200
        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}, 500

class Logout(Resource):
    def delete(self):
        session['player_id'] = None
        return {}, 204

class ChooseWildcard(Resource):
    def post(self, wildcard_id):
        try:
            # Get the player_id from the session
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            # Fetch player data from the database
            player = Player.query.filter(Player.id == player_id).first()
            if not player:
                return {'error': 'Player not found'}, 404

            # Fetch the wildcard data from the database
            wildcard = Wildcard.query.filter(Wildcard.id == wildcard_id).first()
            if not wildcard:
                return {'error': 'Invalid wildcard ID'}, 400

            # Check if the player already chose a wildcard
            if player.wildcard:
                return {'error': 'You have already chosen a wildcard'}, 400

            # Assign the chosen wildcard to the player
            player.wildcard = wildcard

            # Assign the initial persona based on the wildcard
            if wildcard.name == "Makoto Yuki":
                initial_persona = Persona.query.filter_by(name="Orpheus").first()  
            elif wildcard.name == "Yu Narukami":
                initial_persona = Persona.query.filter_by(name="Izanagi").first()  
            elif wildcard.name == "Ren Amamiya":
                initial_persona = Persona.query.filter_by(name="Arsène").first()  

            if initial_persona:
                new_stock = Stock(player_id=player.id, persona_id=initial_persona.id)
                db.session.add(new_stock)

                db.session.commit()
            # Check if persona already exists in the compendium
            existing_entry = Compendium.query.filter_by(player_id=player.id, persona_id=initial_persona.id).first()
            print(f"Compendium entry for persona {initial_persona.id} exists: {existing_entry}")

            if not existing_entry:
                # Persona not in the compendium, add it
                new_compendium_entry = Compendium(player_id=player.id, persona_id=initial_persona.id, in_stock=True)
                db.session.add(new_compendium_entry)
                print(f"Added new entry to Compendium for Persona ID: {initial_persona.id}")

                db.session.commit()
            return {'message': 'Wildcard chosen successfully', 'player': player.to_dict(only=("username","wildcard","level","personas"))}, 200
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
    def get(self):
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
            if len(player.stocks) >= player.stock_limit:
                return {'error': 'You have reached your stock limit.'}, 400

            # Check if player has enough yen (assuming 200 yen per summon)
            if player.yen < 200:
                return {'error': 'Not enough yen.'}, 400

             # Special case: First summon while player is level 1
            if player.level == 1:
                eligible_personas = Persona.query.filter_by(level=1).all()
            elif player.level >=92:
                  # After level 92, allow random summons between level 50 and 90
                  eligible_personas = Persona.query.filter(Persona.level.between(50, 90)).all()
            else:
                # Regular summons, allow level range based on player level
                min_level = max(1, player.level - 3)
                max_level = player.level + 3
                eligible_personas = Persona.query.filter(Persona.level >= min_level, Persona.level <= max_level).all()
            if not eligible_personas:
                return {'error': 'No personas available for your level range.'}, 404
            # Exclude personas that are already in the player's stock
            stock_personas = [stock.persona_id for stock in player.stocks]
            eligible_personas = [persona for persona in eligible_personas if persona.id not in stock_personas]

            # If no eligible personas are left after filtering out those in stock
            if not eligible_personas:
                return {'error': 'You already have all available personas in your stock.'}, 400
            # Randomly select a persona from eligible personas
            selected_persona = random.choice(eligible_personas)
            print(type(selected_persona))
            # Deduct yen from player
            player.yen -= 200
            db.session.commit()

            # Add the selected persona to player's stock
            new_stock = Stock(player_id=player_id, persona_id=selected_persona.id)
            db.session.add(new_stock)
            db.session.commit()
            
            # Debugging: Check if persona already exists in the compendium
            existing_entry = Compendium.query.filter_by(persona_id=selected_persona.id).first()
            print(f"Compendium entry for persona {selected_persona.id} exists: {existing_entry}")

            if not existing_entry:
                # Persona not in the compendium, add it
                new_compendium_entry = Compendium(player_id=player.id, persona_id=selected_persona.id, in_stock=True)
                db.session.add(new_compendium_entry)
                print(f"Added new entry to Compendium for Persona ID: {selected_persona.id}")

            db.session.commit()
            # Increment player level by 1 and give yen for leveling up
            player.level += 1
            player.yen += 100  # 100 yen per level up
            db.session.commit()
            
            # Update stock limit based on the new level
            player.update_stock_limit()
            db.session.commit()
            return make_response(selected_persona.to_dict(only=("name", "level", "arcana.name", "image")), 201)
            
        except Exception as e:
            db.session.rollback()  # Rollback on error
            return {'error': f'An error occurred: {str(e)}'}, 500

class Wildcards(Resource):
    def get(self):
        try:
            
            player_id = session.get('player_id')
            if not player_id:
             return {'error': 'Unauthorized, please log in first'}, 401
            
            # Assuming you have a Wildcards model, you can fetch all wildcards
            wildcards = Wildcard.query.all()
            
            # If no wildcards found
            if not wildcards:
                return {'error': 'No wildcards found'}, 404
            
            # Return the wildcards
            return {
                'wildcards': [wc.to_dict(only=("name", "image","id", "persona_id")) for wc in wildcards]
            }, 200
        
        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}, 500

class Compendiums(Resource):
    def get(self):
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401
            
            
            player_id = session.get('player_id')  # Ensure the player is logged in
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404
            
            # Retrieve all compendium entries for the player
            compendium_entries = Compendium.query.filter_by(player_id=player_id).all()
            if not compendium_entries:
                return {'error': 'No compendium entries found for this player'}, 404

         # Return all personas in the compendium
            return make_response([compendium_entry.persona.to_dict(only=("name", "level", "calculated_price", "arcana.name")) for compendium_entry in compendium_entries], 200)
class BuyPersonaById(Resource):
    def post(self, persona_id):
        try:
            json = request.get_json()

            # Ensure the player is logged in
            
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401
            player_id = session.get('player_id')  # Ensure the player is logged in
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404
            # Check if player's stock is full
            if len(player.stocks) >= player.stock_limit:
                return {'error': 'You have reached your stock limit.'}, 400
            persona = Persona.query.get(persona_id)  # Use the persona_id passed in the URL directly
            if not persona:
                return {'error': 'Persona not found'}, 404

            # # Ensure the persona is in the compendium (based on the Compendium table)
            # if not Compendium.query.filter_by(player_id=player_id, persona_id=persona.id).first():  # Adjusted to check the Compendium table
            #     return {'error': 'Persona not available in the compendium'}, 400
            # Retrieve the persona from the compendium (not the personas table)
            compendium_entry = Compendium.query.filter_by(player_id=player_id, persona_id=persona_id).first()
            if not compendium_entry:
                return {'error': 'Persona not found in the compendium'}, 404
            # Ensure the player doesn't already have this persona in their stock
            if Stock.query.filter_by(player_id=player_id, persona_id=persona.id).first():
                return {'error': 'Persona is already in your stock'}, 400

            # Check if the player has enough yen
            if player.yen < persona.calculated_price:
                return {'error': 'Not enough yen'}, 400

            # Deduct yen and add the persona to the stock
            player.yen -= persona.calculated_price
            db.session.commit()

            # Add the persona to the player's stock
            new_stock = Stock(player_id=player_id, persona_id=persona.id)
            db.session.add(new_stock)

            db.session.commit()

            # Return success message with persona data
            return {'message': 'Persona purchased and added to stock successfully', 
                    'persona': persona.to_dict(only=("name", "arcana.name", "level"))}, 201

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500

class ReleasePersonaById(Resource):
    def delete(self, persona_id):
        try:
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            # Fetch the player and their stock of personas
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            
            stock_entry = Stock.query.filter_by(player_id=player_id, persona_id=persona_id).first()

            if not stock_entry:
                return {'error': 'Persona not found in your stock'}, 404

            # Get the persona's level to calculate yen reward
            persona = Persona.query.get(persona_id)
            if not persona:
                return {'error': 'Persona not found'}, 404

            # Calculate yen reward based on persona's level
            yen_reward = persona.level * 50  # For example, 50 yen per level of the persona

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

class FusePersonasById(Resource):
    def post(self, persona_1_id, persona_2_id):
        try:
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401

            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404

            persona_1 = Persona.query.get(persona_1_id)
            persona_2 = Persona.query.get(persona_2_id)

            if not persona_1 or not persona_2:
                return {'error': 'Invalid persona(s) selected'}, 400

            # Ensure player has both personas in their stock
            if not any(stock.persona_id == persona_1.id for stock in player.stocks) or \
               not any(stock.persona_id == persona_2.id for stock in player.stocks):
                return {'error': 'You must have both personas in your stock to fuse them.'}, 400
            
            # Get the arcana names
            arcana_1_name = persona_1.arcana.name
            arcana_2_name = persona_2.arcana.name
            # Get fusion result from the arcana mapping
            fusion_result = arcana_map.get(arcana_1_name,{}).get(arcana_2_name)

            if not fusion_result:
                return {'error': 'These personas cannot be fused together.'}, 400
            fused_arcana_id= Arcana.query.filter_by(name=fusion_result).first().id
            fusion_min = 50 if player.level > 92 else player.level - 3
            fusion_max = 88 if player.level > 92 else player.level + 3
            resulting_persona = Persona.query.filter(Persona.arcana_id==fused_arcana_id, Persona.level.between(fusion_min,fusion_max)).all()
            fused_persona = random.choice(resulting_persona)
            if not fused_persona:
                return {'error': 'Fusion result persona not found'}, 404

            # Remove the fused persona materials from stock
            Stock.query.filter(Stock.player_id == player_id, Stock.persona_id == persona_1.id).delete()
            Stock.query.filter(Stock.player_id == player_id, Stock.persona_id == persona_2.id).delete()

            # Add the resulting persona to stock
            new_stock = Stock(player_id=player_id, persona_id=fused_persona.id)
            db.session.add(new_stock)
            db.session.commit()

            # Debugging: Check if persona already exists in the compendium
            existing_entry = Compendium.query.filter_by(persona_id=fused_persona.id).first()
            print(f"Compendium entry for persona {fused_persona.id} exists: {existing_entry}")

            if not existing_entry:
                # Persona not in the compendium, add it
                new_compendium_entry = Compendium(player_id=player.id, persona_id=fused_persona.id, in_stock=True)
                db.session.add(new_compendium_entry)
                print(f"Added new entry to Compendium for Persona ID: {fused_persona.id}")

                db.session.commit()
            # Level up the player and give yen based on level increase
            level_up_amount = 5  
            player.level += level_up_amount
            player.yen += level_up_amount * 100  # 100 yen per level up
            db.session.commit()
            # Update stock limit based on the new level
            player.update_stock_limit()

            db.session.commit()

            return make_response(fused_persona.to_dict(only=("name", "arcana.name", "level" )), 201)

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

            return player.to_dict(only=("username", "_password_hash")), 200

        except Exception as e:
            db.session.rollback()
            return {'error': f'An error occurred: {str(e)}'}, 500
class Stocks(Resource):
    def get(self):
            json = request.get_json()
            player_id = session.get('player_id')
            if not player_id:
                return {'error': 'Unauthorized, please log in first'}, 401
            
            
            player_id = session.get('player_id')  # Ensure the player is logged in
            player = Player.query.get(player_id)
            if not player:
                return {'error': 'Player not found'}, 404
            
            # Retrieve all stock entries for the player
            stock_entries = Stock.query.filter_by(player_id=player_id).all()
            if not stock_entries:
                return {'error': 'No stock entries found for this player'}, 404

         # Return all personas in the compendium
            return make_response([stock_entry.persona.to_dict(only=("name", "level", "arcana.name")) for stock_entry in stock_entries], 200)

api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check-session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ChooseWildcard, '/choose-wildcard/<int:wildcard_id>', endpoint='choose_wildcard')
api.add_resource(PersonaByID, '/personas/<int:persona_id>', endpoint='persona_by_id')
api.add_resource(SummonPersona, '/summon-persona', endpoint='summon_persona')
api.add_resource(Wildcards, '/wildcards', endpoint='wildcards')
api.add_resource(Compendiums, '/compendiums', endpoint='compendiums')
api.add_resource(BuyPersonaById, '/buy-persona/<int:persona_id>', endpoint='buy_persona')
api.add_resource(ReleasePersonaById, '/release-persona/<int:persona_id>', endpoint='release_persona')
api.add_resource(FusePersonasById, '/fuse-personas/<int:persona_1_id>/<int:persona_2_id>', endpoint='fuse_personas')
api.add_resource(UpdatePlayerProfile, '/update-player-profile', endpoint='update_player_profile')
api.add_resource(Stocks, '/stocks', endpoint='stocks')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


from sqlalchemy import text
from config import db, app
from models import Arcana, Compendium, Persona, Special_Material, Stock, Wildcard, Player
from table_data import arcanas, wildcards, personas, specials_dict
import bcrypt
with app.app_context():
    print("Deleting all records...")

    # Clear all tables in order
    Special_Material.query.delete()
    Compendium.query.delete()
    Stock.query.delete()
    Wildcard.query.delete()
    Persona.query.delete()
    Player.query.delete()
    Arcana.query.delete()

    print("Creating arcanas...")
    arcana_dict={arcana["name"]: Arcana(name=arcana["name"]) for arcana in arcanas}
    db.session.add_all(arcana_dict.values())
    db.session.commit()


    print("Creating personas...")
    persona_objects = [
        Persona(
            name=persona["name"],
            arcana_id= arcana_dict[persona["arcana"]].id,
            level=persona["level"],
            image=persona["image"],
            in_pool=persona["in_pool"],
            special=persona["special"]
        )
        for persona in personas
    ]
    db.session.add_all(persona_objects)
    db.session.commit()
    print("Creating wildcards...")
    wildcard_objects = [
        Wildcard(
            name=wildcard["name"],
            image=wildcard["image"],
            persona_id=Persona.query.filter_by(name=wildcard["initial_persona_id"]).first().id
        )
        for wildcard in wildcards
    ]
    db.session.add_all(wildcard_objects)
    db.session.commit()

    print("Creating special_materials...") 
   
    for wildcard in specials_dict: 
        wc = next(wild for wild in wildcard_objects if wild.name == wildcard) 
        for result in specials_dict[wildcard]:
            fusion = next(persona for persona in persona_objects if persona.name == result)
            for material in specials_dict[wildcard][result]:
                material_persona = next(persona for persona in persona_objects if persona.name == material)
                db.session.add(Special_Material(wildcard=wc, special_fusion_persona=fusion, material_persona=material_persona))
    
    db.session.commit()
    def hash_password(password):
        # Hash the password with a salt
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt)

# Helper function to create a player for a specific wildcard
    def create_player(wildcard_name):
        wildcard = Wildcard.query.filter_by(name=wildcard_name).first()

        hashed_password = hash_password("Password3#")

        player = Player(
            username=f"{wildcard_name}Player",  
            _password_hash = hashed_password,
            level=99,
            wildcard_id=wildcard.id,  
            stock_limit=12
        )

        db.session.add(player)
        db.session.commit()

        return player

    # Helper function to add personas to the player's stock
    def add_personas_to_stock(player):
        # 5 specific personas to add to the player's stock (adjust names)
        specific_personas = [
            Persona.query.filter_by(name="Samael").first(),  
            Persona.query.filter_by(name="Abaddon").first(),
            Persona.query.filter_by(name="Beelzebub").first(),
            Persona.query.filter_by(name="Satan").first(),
            Persona.query.filter_by(name="Helel").first()
        ]

        for persona in specific_personas:
            if persona:
                stock = Stock(player_id=player.id, persona_id=persona.id)
                db.session.add(stock)

        db.session.commit()

    # Seed function to create a player and add personas to stock
    def seed():
        # Step 1: Create players for each wildcard
     wildcard_names = ["Makoto Yuki", "Yu Narukami", "Ren Amamiya"]
    
     for wildcard_name in wildcard_names:
        # Create a player for each wildcard
        player = create_player(wildcard_name)
        
        # Step 2: Add personas to player's stock
        add_personas_to_stock(player)

        print("Seeding complete!")

    # Call the seed function
    seed()

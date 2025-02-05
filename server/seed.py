from sqlalchemy import text
from config import db, app
from models import Arcana, Compendium, Persona, Special_Material, Stock, Wildcard, Player
from table_data import arcanas, wildcards, personas

with app.app_context():
    print("Deleting all records...")

    # Clear all tables in order
    # db.session.query(Special_Material).delete()
    # db.session.query(Compendium).delete()
    # db.session.query(Stock).delete()
    db.session.query(Persona).delete()
    db.session.query(Wildcard).delete()
    # db.session.query(Player).delete()
    db.session.query(Arcana).delete()

    print("Creating arcanas...")
    arcana_dict={arcana["name"]: Arcana(name=arcana["name"]) for arcana in arcanas}
    db.session.add_all(arcana_dict.values())
    db.session.commit()


    print("Creating personas...")
    db.session.add_all([
        Persona(
            name=persona["name"],
            arcana_id= arcana_dict[persona["arcana"]].id,
            level=persona["level"],
            image=persona["image"],
            in_pool=persona["in_pool"],
            special=persona["special"]
        )
        for persona in personas
    ])
    print("Creating wildcards...")
    db.session.add_all([
        Wildcard(
            name=wildcard["name"],
            image=wildcard["image"],
            initial_persona_id=Persona.query.filter_by(name=wildcard["initial_persona_id"]).id
        )
        for wildcard in wildcards
    ])
#     print("Creating stock...")
#     db.session.add_all([
#     Stock(
#         player_id=1,  
#         persona_id=persona.id
#     )
#     for persona in db.session.query(Persona).filter_by(in_pool=True).all()
# ])
#     db.session.commit()
#     print("Stock creation complete!")

#     print("Creating compendium...")

# # Fetch personas in the pool and create compendium entries
#     compendium_entries = [
#     Compendium(player_id=1, persona_id=persona.id)
#     for persona in db.session.query(Persona).filter_by(in_pool=True).all()
# ]

#     db.session.add_all(compendium_entries)
#     db.session.commit()

#     print("Compendium creation complete!")

#     print("Creating players...")

#     # Assume three wildcards already exist
#     wildcards = db.session.query(Wildcard).all()
#     if len(wildcards) < 3:
#      raise ValueError("Not enough wildcards found. Please seed at least three wildcards.")

# players = [
#     Player(username="Player1", wildcard_id=wildcards[0].id, yen=20000, level=1),
#     Player(username="Player2", wildcard_id=wildcards[1].id, yen=20000, level=1),
#     Player(username="Player3", wildcard_id=wildcards[2].id, yen=20000, level=1),
# ]

# for player in players:
#     player.password_hash = "StrongPassword123!"

# db.session.add_all(players)
# db.session.commit()

# print("Player creation complete!")


db.session.commit()
print("Seeding complete!")

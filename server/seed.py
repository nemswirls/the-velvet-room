from sqlalchemy import text
from config import db, app
from models import Arcana, Compendium, Persona, Special_Material, Stock, Wildcard, Player
from table_data import arcanas, wildcards, personas

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
    db.session.commit()
    print("Creating wildcards...")
    db.session.add_all([
        Wildcard(
            name=wildcard["name"],
            image=wildcard["image"],
            persona_id=Persona.query.filter_by(name=wildcard["initial_persona_id"]).first().id
        )
        for wildcard in wildcards
    ])
    db.session.commit()

    # print("Creating special_materials...")
    # db.session.add_all([
    #     Special_Material(
    #         wildcard_id=Wildcard.query.filter_by(name=material["wildcard_id"]).first().id,
    #         special_fusion_id=Persona.query.filter_by(name=material["special_fusion_id"]).first().id,
    #         material_id=Persona.query.filter_by(name=material["material_id"]).first().id
    #     )
    #     for material in wildcards
    # ])

    print("Seeding complete!")

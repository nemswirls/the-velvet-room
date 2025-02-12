from sqlalchemy import text
from config import db, app
from models import Arcana, Compendium, Persona, Special_Material, Stock, Wildcard, Player
from table_data import arcanas, wildcards, personas, specials_dict

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

    # print("Creating special_materials...") 
   
    # for wildcard in specials_dict: 
    #     wc = next(wild for wild in wildcard_objects if wild.name == wildcard) 
    #     for result in specials_dict[wildcard]:
    #         fusion = next(persona for persona in persona_objects if persona.name == result)
    #         for material in specials_dict[wildcard][result]:
    #             material_persona = next(persona for persona in persona_objects if persona.name == material)
    #             db.session.add(Special_Material(wildcard=wc, special_fusion_persona=fusion, material_persona=material_persona))
    
    # db.session.commit()
    print("Seeding complete!")

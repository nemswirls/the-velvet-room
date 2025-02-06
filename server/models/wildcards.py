from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Wildcard(db.Model, SerializerMixin):
    __tablename__ = "wildcards"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    image = db.Column(db.String)
    persona_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)
    
    # Relationship to the initial persona
    initial_persona = db.relationship("Persona", back_populates="wildcards")

    # Relationship to the players
    players= db.relationship("Player", back_populates="wildcard")

   # Define the relationship with special_fusions
    # special_fusions = db.relationship(
    #     "Persona",
    #     secondary="special_materials",
    #     primaryjoin="Wildcard.id == special_materials.c.wildcard_id",
    #     secondaryjoin="Persona.id == special_materials.c.persona_id",
    #     foreign_keys="[special_materials.c.wildcard_id, special_materials.c.persona_id]",
    #     backref="wildcards",
    # )

    serialize_rules = ('-players.wildcard','-initial_persona.wildcards')
    def __repr__(self):
        
       return (f'<Wildcard id: {self.id} Name: {self.name} '
        f'Image: {self.image} Initial Persona: {self.persona_id}>')
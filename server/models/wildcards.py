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
    
    initial_persona = db.relationship("Persona", back_populates="wildcard", lazy="select")
    players = db.relationship("Player", back_populates="wildcard", lazy="select")
    special_materials = db.relationship("Special_Material", back_populates="wildcard")
    serialize_rules = ('-players.wildcard','-initial_persona.wildcard', "-special_materials.wildcard",)
    def __repr__(self):
        
       def __repr__(self):
        return f"<Wildcard(id={self.id}, name='{self.name}')>"
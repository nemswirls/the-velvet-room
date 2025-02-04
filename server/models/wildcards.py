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
    initial_persona_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)
    
    # Relationship to the initial persona
    initial_persona = db.relationship("Persona", backref="wildcards", uselist=False)

    # Relationship to special fusions (many-to-many)
    special_fusions = db.relationship("Persona", secondary="special_materials", backref="wildcards_with_special_fusions")
    def __repr__(self):
        return (f'<Wildcard id: {self.id} Name: {self.name} '
                f'Image: {self.image} Initial Persona ID: {self.initial_persona_id}>')
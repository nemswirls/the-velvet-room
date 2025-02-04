from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Stock(db.Model, SerializerMixin):
    __tablename__ = "stocks"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players_id"), nullable=False)
    persona_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)

    # Relationship with Player
    player = db.relationship('Player', backref='stocks')

    # Relationship with Persona
    persona = db.relationship('Persona', backref='stocks')

    def __repr__(self):
        return f'<Stock id: {self.id} Player ID: {self.player_id} Persona ID: {self.persona_id}>'
        
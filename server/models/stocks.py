from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Stock(db.Model, SerializerMixin):
    __tablename__ = "stocks"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)  
    persona_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)

    player = db.relationship('Player', back_populates='stocks', lazy="select")
    persona = db.relationship('Persona', back_populates='stocks', lazy="select")

    # Serialization rules
    serialize_rules = ('-player.stocks', '-persona.stocks',)

    def __repr__(self):
        return f'<Stock id: {self.id} Player ID: {self.player_id} Persona ID: {self.persona_id}>'
        
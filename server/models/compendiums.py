from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Compendium(db.Model, SerializerMixin):
    __tablename__ = "compendiums"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    persona_id = db.Column(db.Integer, db.ForeignKey('personas.id'), nullable=False)
    in_stock = db.Column(db.Boolean, default=True, nullable=False)

    player = db.relationship('Player', back_populates='compendiums', lazy="select")
    persona = db.relationship('Persona', back_populates='compendiums', lazy="select")
    # Serialization rules
    serialize_rules = ('-player.compendiums', '-persona.compendiums',)

    __table_args__ = (
        CheckConstraint('in_stock IN (0, 1)', name='check_in_stock_boolean'),
    )


    
    
    def __repr__(self):
        return f"<Compendium(id={self.id}, player_id={self.player_id}, persona_id={self.persona_id}, in_stock={self.in_stock})>"
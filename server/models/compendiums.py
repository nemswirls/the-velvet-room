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
    in_stock = db.Column(db.Boolean, default=True)

    # Relationship to Player
    player = db.relationship('Player', backref='compendiums')

    # Relationship to Persona
    persona = db.relationship('Persona', backref='compendiums')

    # Serialization rules
    serialize_rules = ('-player.compendiums', '-persona.compendiums')

    __table_args__ = (
        CheckConstraint('in_stock IN (0, 1)', name='check_in_stock_boolean'),
    )


    
    
    def __repr__(self):
        return (f'<Compendium id: {self.id} Player id: {self.player_id} '
                f'Persona id: {self.persona_id} In stock: {self.in_stock} ')
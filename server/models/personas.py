from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Persona(db.Model, SerializerMixin):
    __tablename__ = "personas"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    level = db.Column(db.Integer, nullable=False)
    in_pool = db.Column(db.Boolean, default=True)
    arcana_id = db.Column(db.Integer, db.ForeignKey('arcanas.id'), nullable=False)
    # price = db.Column(db.Integer, nullable= False)
    special = db.Column(db.Boolean, default=False)
    image = db.Column(db.String)
    
    # Relationship to Arcana
    arcana = db.relationship('Arcana', backref='personas')

    # Relationship with the compendium, if the persona is available there
    compendium_entries = db.relationship('Compendium', backref='persona', lazy=True)

    __table_args__ = (
        CheckConstraint('level >= 1', name='level_greater_than_zero'),
    )
     # Serialization rules
    serialize_rules = ('-arcana.personas',)
    
    @hybrid_property
    def calculated_price(self):
        # This is the property for the calculated price based on the persona's level
        return self.level * 100

    @calculated_price.expression
    def calculated_price(cls):
        # The SQL equivalent of the calculation, so that it can be used in queries
        return cls.level * 100
    def __repr__(self):
        return (f'<Persona id: {self.id} Name: {self.name} (Level {self.level}) '
                f' Special: {self.special} '
                f'Arcana id: {self.arcana_id} In pool: {self.in_pool} Image: {self.image}>')
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
    special = db.Column(db.Boolean, default=False)
    image = db.Column(db.String)
    
    arcana = db.relationship("Arcana", back_populates="personas")
    wildcard = db.relationship("Wildcard", back_populates="initial_persona", uselist=False, lazy="select")
    stocks = db.relationship("Stock", back_populates="persona", lazy="select")
    compendiums = db.relationship("Compendium", back_populates="persona", lazy="select")
    special_fusions = db.relationship("Special_Material", foreign_keys="[Special_Material.special_fusion_id]", back_populates="special_fusion_persona")
    materials = db.relationship("Special_Material", foreign_keys="[Special_Material.material_id]", back_populates="material_persona")
     # Serialization rules
    serialize_rules = ('-arcana.personas', '-wildcard.initial_persona', '-compendiums.persona', '-stocks.persona', "-special_fusions.special_fusion_persona", "-materials.material_persona" )

    __table_args__ = (
        CheckConstraint('level >= 1', name='level_greater_than_zero'),
    )
    
    
    @hybrid_property
    def calculated_price(self):
        # This is the property for the calculated price based on the persona's level
        return self.level * 100

    @calculated_price.expression
    def calculated_price(cls):
        # The SQL equivalent of the calculation, so that it can be used in queries
        return cls.level * 100
    def __repr__(self):
        return f"<Persona(id={self.id}, name='{self.name}', level={self.level})>"
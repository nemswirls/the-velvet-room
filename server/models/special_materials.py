from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from config import db


class Special_Material(db.Model, SerializerMixin):
    __tablename__ = "special_materials"

    id = db.Column(db.Integer, primary_key=True)
    wildcard_id = db.Column(db.Integer, db.ForeignKey("wildcards.id"), nullable=False)
    special_fusion_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)
    material_id = db.Column(db.Integer, db.ForeignKey("personas.id"), nullable=False)

    # Relationships
    wildcard = db.relationship("Wildcard", back_populates="special_materials")
    special_fusion_persona = db.relationship("Persona", foreign_keys=[special_fusion_id], back_populates="special_fusions")
    material_persona = db.relationship("Persona", foreign_keys=[material_id], back_populates="materials")

    serialize_rules = ("-wildcard.special_materials", "-special_fusion_persona.special_fusions", "-material_persona.materials", "-materials.material_persona", "-special_fusions.special_fusion_persona", 
                       "-special_fusion_persona.materials", "-material_personas.special_fusions", "-special_materials.wildcard" )

    def __repr__(self):
        return (f'<Special_Material id: {self.id} Wildcard ID: {self.wildcard_id} '
                f'Special Fusion ID: {self.special_fusion_id} Material ID: {self.material_id}>')
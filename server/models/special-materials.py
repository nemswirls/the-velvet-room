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

    # Relationship with Wildcard
    wildcard = db.relationship("Wildcard", backref="special_materials")

    # Relationship to Personas (special_fusion_id and material_id)
    special_fusion = db.relationship("Persona", foreign_keys=[special_fusion_id], backref="special_fusion_materials")
    material = db.relationship("Persona", foreign_keys=[material_id], backref="special_materials")

    serialize_rules = ('-wildcard.special_materials', '-special_fusion.special_materials', '-material.special_materials')

    def __repr__(self):
        return (f'<Special_Material id: {self.id} Wildcard ID: {self.wildcard_id} '
                f'Special Fusion ID: {self.special_fusion_id} Material ID: {self.material_id}>')
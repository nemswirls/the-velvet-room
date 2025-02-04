from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.exc import IntegrityError
from sqlalchemy import CheckConstraint
from config import db, bcrypt
import re

class Player(db.Model, SerializerMixin):
    _tablename_= "players"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, default=1, nullable=False)
    wildcard_id = db.Column(db.String, nullable=False)
    yen = db.Column(db.Integer, default=10000, nullable=False)

    def __repr__(self):
        return (f'<Player id: {self.id} Username: {self.username} '
                f'Level: {self.level} Wildcard ID: {self.wildcard_id} '
                f'Yen: {self.yen}>')
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
    wildcard_id = db.Column(db.Integer, db.ForeignKey("wildcards.id"), nullable=False)
    yen = db.Column(db.Integer, default=20000, nullable=False)
    stock_limit = db.Column(db.Integer, default=6)  # Starting stock is 6
    
    # Relationship with Wildcard
    wildcard = db.relationship("Wildcard", backref="players")

    # Add relationship to Stock model
    stock = db.relationship('Stock', backref='player', lazy='dynamic')

    # Serialization rules to include Wildcard and exclude password fields
    serialize_rules = ('-password_hash', '-_password_hash', 'wildcard')

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        self.validate_password(password)
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def validate_password(self, password):
        """Validates password complexity."""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', password):
            raise ValueError("Password must include at least one uppercase letter.")
        if not re.search(r'[a-z]', password):
            raise ValueError("Password must include at least one lowercase letter.")
        if not re.search(r'\d', password):
            raise ValueError("Password must include at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValueError("Password must include at least one special character.")
        return True

    @validates('username')
    def validate_username(self, key, value):
        if not value or len(value) < 3:
            raise ValueError("Username is required and must be at least 3 characters long.")
        if db.session.query(Player).filter(Player.username == value).first():
            raise ValueError("Username is already taken.")
        return value
def update_stock_limit(player):
    # Increase stock limit by 1 every 10 levels, capped at 12
    if player.level < 10:
        player.stock_limit = 6  # Starting stock is 6
    elif player.level < 20:
        player.stock_limit = 7
    elif player.level < 30:
        player.stock_limit = 8
    elif player.level < 40:
        player.stock_limit = 9
    elif player.level < 50:
        player.stock_limit = 10
    elif player.level < 60:
        player.stock_limit = 11
    else:
        player.stock_limit = 12  # Cap at 12
        db.session.commit()  # Commit changes to the database

    def __repr__(self):
        return (f'<Player id: {self.id} Username: {self.username} '
                f'Level: {self.level} Wildcard ID: {self.wildcard_id} '
                f'Yen: {self.yen}>')
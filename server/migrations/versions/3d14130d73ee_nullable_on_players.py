"""nullable on players

Revision ID: 3d14130d73ee
Revises: 92aeb183467a
Create Date: 2025-02-05 13:28:18.299551

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d14130d73ee'
down_revision = '92aeb183467a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('players', schema=None) as batch_op:
        batch_op.alter_column('wildcard_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('players', schema=None) as batch_op:
        batch_op.alter_column('wildcard_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###

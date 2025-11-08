# seed_user.py
from app.main import SessionLocal, User, hash_password
from sqlalchemy import select

EMAIL = "pat@email.com"
PASSWORD = "123456"
NAME = "Pat"

db = SessionLocal()
try:
    existing = db.scalar(select(User).where(User.email == EMAIL.lower()))
    if existing:
        # update password if you want to overwrite:
        existing.password_hash = hash_password(PASSWORD)
        existing.name = NAME
        db.commit()
        print(f"Updated password for {EMAIL}")
    else:
        u = User(
            email=EMAIL.lower(),
            name=NAME,
            password_hash=hash_password(PASSWORD),
        )
        db.add(u)
        db.commit()
        db.refresh(u)
        print(f"Created user id={u.id} email={u.email}")
finally:
    db.close()

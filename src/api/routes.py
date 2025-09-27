"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
from api.models import db, User, Cat, Sponsor, PaymentRegistration
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select, exc
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import stripe
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

ph = PasswordHasher()
api = Blueprint('api', __name__)

# CORS: permitir frontend local y desplegado
frontend_urls = [
    "https://super-duper-capybara-q74x9x54gxg924jjp-3000.app.github.dev",
    "https://ayudaanimal-1.onrender.com"
]
CORS(api, resources={r"/*": {"origins": frontend_urls}})

# -------------------- Usuarios --------------------
@api.route('/signup', methods=['POST'])
def create_user():
    body = request.get_json()
    required_fields = ['email', 'password']
    if not all(field in body for field in required_fields):
        return jsonify({'err': 'Bad request, missing email or password'}), 400

    search_exist = select(User).where(User.email == body['email'])
    already_exist = db.session.execute(search_exist).scalar_one_or_none()
    if already_exist:
        return jsonify({"error": "User already exists"}), 409

    try:
        hashed_password = ph.hash(body['password'])
    except Exception:
        return jsonify({'error': 'Failed to hash password'}), 500

    user = User(email=body['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'Ok': "User created"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if 'email' not in body or 'password' not in body:
        return jsonify({'err': 'Bad request'}), 400

    user = User.query.filter_by(email=body['email']).first()
    if not user:
        return jsonify({"err": "User not exist"}), 404

    try:
        ph.verify(user.password, body['password'])
    except VerifyMismatchError:
        return jsonify({'err': 'Invalid password'}), 401
    except Exception:
        return jsonify({'err': 'Error verifying password'}), 500

    token = create_access_token(identity=str(user.id))
    is_admin = user.email == 'admin@admin.com'
    return jsonify({'token': token, 'is_admin': is_admin}), 200

@api.route('/user/user-data', methods=['GET'])
@jwt_required()
def user_data():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({"err": "User not exist"}), 400
    return jsonify({"user": user.serialize()}), 200

@api.route('/user', methods=['GET'])
def get_all_user():
    all_users = db.session.execute(select(User)).scalars().all()
    return jsonify({"Users": [user.serialize() for user in all_users]}), 200

@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_for_id(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'err': "User not found"}), 404
    return jsonify({"User": user.serialize()}), 200

@api.route('/editUser', methods=['PUT'])
@jwt_required()
def edit_user():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

        editable_fields = ["name", "lastname", "birthdate"]
        for field in editable_fields:
            if field in data:
                if field == "birthdate" and data[field]:
                    user.birthdate = datetime.fromisoformat(data[field])
                else:
                    setattr(user, field, data[field])

        db.session.commit()
        return jsonify({"success": True, "user": user.serialize()}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -------------------- Gatos --------------------
@api.route('/cat', methods=['POST'])
def create_cat():
    body = request.get_json()
    required_fields = ['name', 'age', 'race', 'castration', 'character', 'image', 'history']
    if not all(field in body for field in required_fields):
        return jsonify({'err': 'Bad request'}), 400

    search_exist = select(Cat).where(Cat.name == body['name'])
    alredy_exist = db.session.execute(search_exist).scalar_one_or_none()
    if alredy_exist:
        return jsonify({'err': 'The cat already exists'}), 409

    cat = Cat(**{field: body[field] for field in required_fields})
    db.session.add(cat)
    db.session.commit()
    return jsonify({'ok': 'Cat added'}), 201

@api.route('/cat', methods=['GET'])
def get_all_cat():
    all_cats = db.session.execute(select(Cat)).scalars().all()
    return jsonify({"cats": [cat.serialize() for cat in all_cats]}), 200

@api.route('/cat/<int:cat_id>', methods=['GET'])
def get_cat_for_id(cat_id):
    cat = db.session.get(Cat, cat_id)
    if not cat:
        return jsonify({'err': "Cat not found"}), 404
    return jsonify({"Cat": cat.serialize()}), 200

@api.route('/cat/<int:cat_id>', methods=['PUT'])
def edit_cat(cat_id):
    cat = db.session.get(Cat, cat_id)
    if not cat:
        return jsonify({'error': 'Cat not found'}), 404

    data = request.get_json()
    editable_fields = ["name", "age", "race", "castration", "character", "history", "image"]
    for field in editable_fields:
        if field in data:
            setattr(cat, field, data[field])

    db.session.commit()
    return jsonify({'success': True, 'cat': cat.serialize()}), 200

@api.route('/cat/<int:cat_id>', methods=['PATCH'])
def update_cat(cat_id):
    cat = db.session.get(Cat, cat_id)
    if not cat:
        return jsonify({'error': 'Cat not found'}), 404

    data = request.get_json()
    allowed_fields = ["name", "age", "race", "castration", "character", "history", "image"]
    for field in allowed_fields:
        if field in data:
            setattr(cat, field, data[field])

    db.session.commit()
    return jsonify({'success': True, 'cat': cat.serialize()}), 200

@api.route('/cat/<int:cat_id>', methods=['DELETE'])
def handle_delete_cat(cat_id):
    cat = db.session.get(Cat, cat_id)
    if not cat:
        return jsonify({"error": "Cat not found"}), 404
    try:
        db.session.delete(cat)
        db.session.commit()
        return jsonify({"message": "Cat deleted"}), 200
    except exc.IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Cannot delete Cat: it is referenced by other records"})

# -------------------- Sponsors --------------------
@api.route('/sponsor', methods=['POST'])
def create_sponsor():
    body = request.get_json()
    if "user_id" not in body or "cat_id" not in body:
        return jsonify({'err': 'Bad request'}), 400

    sponsor = Sponsor(user_id=body['user_id'], cat_id=body['cat_id'])
    db.session.add(sponsor)
    db.session.commit()
    return jsonify({'ok': "sponsor add"}), 201

@api.route('/sponsor', methods=['GET'])
def get_all_sponsor():
    all_sponsor = db.session.execute(select(Sponsor)).scalars().all()
    return jsonify({"Sponsor": [s.serialize() for s in all_sponsor]}), 200

# -------------------- Payments --------------------
@api.route('/payment-registration', methods=['POST'])
@jwt_required()
def create_payment():
    body = request.get_json()
    current_user_id = get_jwt_identity()
    if "cat_id" not in body or "amount" not in body or "date_payment" not in body:
        return jsonify({'err': 'Bad request'}), 400

    cat_id = body['cat_id']
    amount = body['amount']
    date_payment = body['date_payment']

    sponsor = db.session.execute(
        select(Sponsor).where(
            Sponsor.user_id == current_user_id,
            Sponsor.cat_id == cat_id
        )
    ).scalar_one_or_none()
    if sponsor is None:
        sponsor = Sponsor(user_id=current_user_id, cat_id=cat_id)
        db.session.add(sponsor)
        db.session.commit()

    payment = PaymentRegistration(sponsor_id=sponsor.id, amount=amount, date_payment=date_payment)
    db.session.add(payment)

from flask import Flask, request, json
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import (create_access_token, create_refresh_token, JWTManager)
from marshmallow_enum import EnumField
from flask_cors.extension import CORS
from datetime import datetime
import enum

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'boost-is-the-secret-of-our-app'
CORS(app)

## MODELOS & ESQUEMAS
#usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=1)
    email = db.Column(db.String(120), unique=1, nullable=0)
    usuario = db.Column(db.String(80), unique=1, nullable=0)
    contrasena = db.Column(db.String(120), nullable=0)
    #Relaciones
    eventos = db.relationship('Evento', backref='usuario', lazy=1)
class UsuarioSchema(ma.Schema):
    class Meta:
        fields = ("id", "email", "usuario")
usuarioSchema = UsuarioSchema()
usuariosSchema = UsuarioSchema(many=1)

#categoría (ENUM)
class Categoria(enum.Enum):
    CONFERENCIA = "conferencia"
    SEMINARIO = "seminario"
    CONGRESO = "congreso"
    CURSO = "curso"

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_
#evento
class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=1)
    nombre = db.Column(db.String(120))
    categoria = db.Column(db.Enum(Categoria))
    lugar = db.Column(db.String(150))
    direccion = db.Column(db.String(220))
    f_creacion = db.Column(db.DateTime)
    f_inicio = db.Column(db.DateTime)
    f_fin = db.Column(db.DateTime)
    presencial = db.Column(db.Boolean)
    #Relaciones
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=0)
class EventoSchema(ma.Schema):
    categoria = EnumField(Categoria, by_value=1)
    class Meta:
        fields = ("id", "nombre", "categoria", "lugar", "direccion", "f_creacion", "f_inicio", "f_fin", "presencial", "usuario_id")
evento_schema = EventoSchema()
eventos_schema = EventoSchema(many=1)

## API REST
@app.route('/api/registro', methods=['POST'])
def registro():
    data = json.loads(request.data)
    print(data)
    if data == None:
        return {"error": "Los datos son nulos"}
    print('usuario' in data)
    print('email' in data)
    print('contrasena' in data)
    if 'usuario' in data and 'email' in data and 'contrasena' in data:
        if Usuario.query.filter(Usuario.usuario == data["usuario"]).first():
            return {"error": "El usuario ya está registrado"}, 403
        if Usuario.query.filter(Usuario.email == data["email"]).first():
            return {"error": "El email ya está registrado"}, 403
        usuario = Usuario(
            email=data["email"],
            usuario=data["usuario"],
            contrasena=data["contrasena"]
        )
        db.session.add(usuario)
        db.session.commit()

        access_token = create_access_token(identity=data["usuario"])
        refresh_token = create_refresh_token(identity=data["usuario"])
        return {
            'id': usuario.id,
            'usuario': usuario.usuario,
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    else:
        return {'error': 'No se pudieron procesar los datos'}, 403

@app.route('/api/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    print(data)
    if data == None:
        return {"error": "Los datos son nulos"}, 403
    usuario = Usuario.query.filter(Usuario.usuario == data["usuario"]).first()
    if not usuario:
        return {"error": "El usuario no está registrado"}, 404

    if usuario.contrasena == data["contrasena"]:
        access_token = create_access_token(identity=usuario.usuario)
        refresh_token = create_refresh_token(identity=usuario.usuario)
        return {
            "id": usuario.id,
            "usuario": usuario.usuario,
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    else:
        return {"error": "Contraseña Incorrecta"}

@app.route('/api/eventos/<int:idu>', methods=['GET'])
def getEventos(idu):
    evs = Evento.query.filter(Evento.usuario_id == idu)
    if evs.first() != None:
        evs = evs.order_by(Evento.f_creacion.desc())
        return eventos_schema.dumps(evs)
    else:
        return {"error": "No se encontraron eventos para el usuario"}, 404

@app.route('/api/eventos/<int:idu>', methods=['POST'])
def postEvento(idu):
    data = json.loads(request.data)
    print(data)
    if not data:
        return {"error": "No se proporcionó la información del evento"}, 403
    if Usuario.query.filter(Usuario.id == idu).first() == None:
        return {"error": "El usuario no está registrado"}
    if Evento.query.filter(Evento.usuario_id == idu).filter(Evento.nombre == data["nombre"]).first():
        return {"error": "Ya existe un evento con el mismo nombre"}, 403
    if not Categoria.has_value(data["categoria"].lower()):
        return {"error": "La categoría no es válida"}, 403
    f_inicio = datetime.fromtimestamp(data["f_inicio"] / 1000.0)
    print("Fecha Inicio:", f_inicio)
    print(f_inicio <= datetime.now())
    if f_inicio <= datetime.now():
        return {"error": "La fecha de inicio es menor o igual a la fecha actual"}, 403
    f_fin = datetime.fromtimestamp(data["f_fin"] / 1000.0)
    print("Fecha Fin:", f_fin)
    if f_inicio >= f_fin:
        return {"error": "La fecha de inicio es igual o mayor a la de fin"}, 403
    evt = Evento(
        nombre=data["nombre"],
        categoria=Categoria(data["categoria"].lower()),
        lugar=data["lugar"],
        direccion=data["direccion"],
        f_creacion=datetime.now(),
        f_inicio=f_inicio,
        f_fin=f_fin,
        presencial=data["presencial"],
        usuario_id=idu
    )
    db.session.add(evt)
    db.session.commit()
    return {"exito": "Evento creado!", "id": evt.id}

@app.route('/api/eventos/<int:idu>/<int:ide>', methods=['PUT'])
def putEvento(idu, ide):
    evt = Evento.query.get_or_404(ide)
    data = json.loads(request.data)
    print(data)
    if evt:
        if 'nombre' in data:
            if Evento.query.filter(Evento.usuario_id == idu).filter(Evento.nombre == data["nombre"]).first():
                return {"error": "Ya existe un evento con el mismo nombre"}, 403
            evt.nombre = data['nombre']
        if 'categoria' in data:
            if not Categoria.has_value(data["categoria"].lower()):
                return {"error": "La categoría no es válida"}, 403
            evt.categoria = Categoria(data["categoria"].lower())
        if 'lugar' in data:
            evt.lugar = data["lugar"]
        if 'direccion' in data:
            evt.direccion = data["direccion"]
        if 'f_inicio' in data:
            f_inicio = datetime.fromtimestamp(data["f_inicio"] / 1000.0)
            if f_inicio <= datetime.now():
                return {"error": "La fecha de inicio es menor o igual a la fecha actual"}, 403
            f_fin = evt.f_fin if('f_fin' not in data) else datetime.fromtimestamp(data["f_fin"] / 1000.0)
            if f_inicio >= f_fin:
                return {"error": "La fecha de inicio es igual o mayor a la de fin"}, 403
            evt.f_inicio = f_inicio
        if 'f_fin' in data:
            f_fin = datetime.fromtimestamp(data["f_fin"] / 1000.0)
            f_inicio = evt.f_inicio if('f_inicio' not in data) else datetime.fromtimestamp(data["f_inicio"] / 1000.0)
            if f_inicio >= f_fin:
                return {"error": "La fecha de inicio es igual o mayor a la de fin"}, 403
            evt.f_fin = f_fin
        if 'presencial' in data:
            evt.presencial = data["presencial"]
        db.session.commit()
        return {"exito": 'Evento actualizado!'}
    else:
        return {"error": "Evento no encontrado"}

@app.route('/api/eventos/<int:ide>', methods=['DELETE'])
def deleteEvento(ide):
    evt = Evento.query.get_or_404(ide)
    if evt:
        db.session.delete(evt)
        db.session.commit()
        return {"exito": "Evento eliminado!"}

if __name__ == '__main__':
    app.run()

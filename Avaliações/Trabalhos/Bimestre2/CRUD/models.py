from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Tabelas de associação
autores_primarios = db.Table('autores_primarios',
    db.Column('autor_id', db.Integer, db.ForeignKey('autores.id'), primary_key=True),
    db.Column('livro_id', db.Integer, db.ForeignKey('livros.id'), primary_key=True)
)

autores_secundarios = db.Table('autores_secundarios',
    db.Column('autor_id', db.Integer, db.ForeignKey('autores.id'), primary_key=True),
    db.Column('livro_id', db.Integer, db.ForeignKey('livros.id'), primary_key=True)
)

class Autor(db.Model):
    __tablename__ = 'autores'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    nacionalidade = db.Column(db.String(50))
    data_nascimento = db.Column(db.String(10))
    livros_primarios = db.relationship('Livro', secondary=autores_primarios, back_populates='autores_primarios')
    livros_secundarios = db.relationship('Livro', secondary=autores_secundarios, back_populates='autores_secundarios')

class Livro(db.Model):
    __tablename__ = 'livros'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    genero = db.Column(db.String(50))
    data_publicacao = db.Column(db.String(10))
    localizacao = db.Column(db.String(50))
    idioma = db.Column(db.String(20))
    tipo_obra = db.Column(db.String(20))
    autores_primarios = db.relationship('Autor', secondary=autores_primarios, back_populates='livros_primarios')
    autores_secundarios = db.relationship('Autor', secondary=autores_secundarios, back_populates='livros_secundarios')


class Usuario(db.Model):
    __tablename__ = 'usuarios'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)

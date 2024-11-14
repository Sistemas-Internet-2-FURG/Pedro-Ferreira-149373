class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:Pp03012003@localhost:5432/biblioteca_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'sua_chave_jwt_secreta'

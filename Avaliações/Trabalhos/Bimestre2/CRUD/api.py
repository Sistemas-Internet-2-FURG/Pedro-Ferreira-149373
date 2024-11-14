from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from models import db, Autor, Livro, Usuario


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Pp03012003@localhost:5432/biblioteca_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'sua_chave_jwt_secreta'

# Inicializa o CORS e JWTManager
jwt = JWTManager(app)
CORS(app)

# Inicializa o SQLAlchemy com o app Flask
db.init_app(app)

# Inicializar o banco de dados quando o contexto do app estiver ativo
with app.app_context():
    db.create_all()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Busca o usuário com base no nome de usuário e senha em texto simples
    usuario = Usuario.query.filter_by(username=username, password=password).first()
    if usuario:
        access_token = create_access_token(identity={"username": usuario.username, "role": usuario.role})
        return jsonify(access_token=access_token), 200
    return jsonify({"mensagem": "Credenciais inválidas"}), 401



# Endpoint para registro de novos usuários
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"mensagem": "Dados incompletos"}), 400
    username = data['username']
    password = data['password']
    role = data['role']
    usuario_existente = Usuario.query.filter_by(username=username).first()
    if usuario_existente:
        return jsonify({"mensagem": "Usuário já existe."}), 409
    novo_usuario = Usuario(username=username, password=password, role=role)
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"mensagem": "Usuário registrado com sucesso"}), 201

# Criar autor (somente administrador)
@app.route('/autores', methods=['POST'])
@jwt_required()
def criar_autor():
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403

    try:
        data = request.get_json()
        
        # Verificação dos campos obrigatórios
        if not data or 'nome' not in data or 'nacionalidade' not in data or 'data_nascimento' not in data:
            return jsonify({'mensagem': 'Dados incompletos. Certifique-se de que todos os campos foram preenchidos.'}), 422
        
        nome = data['nome']
        nacionalidade = data['nacionalidade']
        data_nascimento = data['data_nascimento']
        
        novo_autor = Autor(nome=nome, nacionalidade=nacionalidade, data_nascimento=data_nascimento)
        db.session.add(novo_autor)
        db.session.commit()
        
        return jsonify({'mensagem': 'Autor criado com sucesso'}), 201
    except Exception as e:
        return jsonify({'mensagem': f'Erro interno ao processar dados: {str(e)}'}), 500


# Listar autores
@app.route('/autores', methods=['GET'])
@jwt_required()
def listar_autores():
    try:
        autores = Autor.query.all()
        resultado = [{'id': autor.id, 'nome': autor.nome, 'nacionalidade': autor.nacionalidade, 'data_nascimento': autor.data_nascimento} for autor in autores]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({'mensagem': f'Erro ao listar autores: {str(e)}'}), 500


# Atualizar autor
@app.route('/autores/<int:autor_id>', methods=['PUT'])
@jwt_required()
def atualizar_autor(autor_id):
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    data = request.get_json()
    autor = Autor.query.get(autor_id)
    if not autor:
        return jsonify({'mensagem': 'Autor não encontrado'}), 404
    autor.nome = data.get('nome', autor.nome)
    autor.nacionalidade = data.get('nacionalidade', autor.nacionalidade)
    autor.data_nascimento = data.get('data_nascimento', autor.data_nascimento)
    db.session.commit()
    return jsonify({'mensagem': 'Autor atualizado com sucesso'}), 200

# Deletar autor
@app.route('/autores/<int:autor_id>', methods=['DELETE'])
@jwt_required()
def deletar_autor(autor_id):
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    autor = Autor.query.get(autor_id)
    if not autor:
        return jsonify({'mensagem': 'Autor não encontrado'}), 404
    db.session.delete(autor)
    db.session.commit()
    return jsonify({'mensagem': 'Autor deletado com sucesso'}), 200

# Criar livro (somente administrador)
@app.route('/livros', methods=['POST'])
@jwt_required()
def criar_livro():
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    data = request.get_json()
    titulo = data.get('titulo')
    genero = data.get('genero')
    data_publicacao = data.get('data_publicacao')
    localizacao = data.get('localizacao')
    idioma = data.get('idioma')
    tipo_obra = data.get('tipo_obra')
    ids_primarios = data.get('autores_primarios', [])
    ids_secundarios = data.get('autores_secundarios', [])

    novo_livro = Livro(titulo=titulo, genero=genero, data_publicacao=data_publicacao,
                       localizacao=localizacao, idioma=idioma, tipo_obra=tipo_obra)
    
    for autor_id in ids_primarios:
        autor = Autor.query.get(autor_id)
        if autor:
            novo_livro.autores_primarios.append(autor)

    for autor_id in ids_secundarios:
        autor = Autor.query.get(autor_id)
        if autor:
            novo_livro.autores_secundarios.append(autor)

    db.session.add(novo_livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro criado com sucesso'}), 201

# Listar livros
@app.route('/livros', methods=['GET'])
@jwt_required()
def listar_livros():
    try:
        livros = Livro.query.all()
        resultado = [{
            'id': livro.id,
            'titulo': livro.titulo,
            'genero': livro.genero,
            'data_publicacao': livro.data_publicacao,
            'localizacao': livro.localizacao,
            'idioma': livro.idioma,
            'tipo_obra': livro.tipo_obra,
            'autores_primarios': [{'id': autor.id, 'nome': autor.nome} for autor in livro.autores_primarios],
            'autores_secundarios': [{'id': autor.id, 'nome': autor.nome} for autor in livro.autores_secundarios]
        } for livro in livros]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({'mensagem': f'Erro ao listar livros: {str(e)}'}), 500


# Atualizar livro
@app.route('/livros/<int:livro_id>', methods=['PUT'])
@jwt_required()
def atualizar_livro(livro_id):
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    data = request.get_json()
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'mensagem': 'Livro não encontrado'}), 404
    livro.titulo = data.get('titulo', livro.titulo)
    livro.genero = data.get('genero', livro.genero)
    livro.data_publicacao = data.get('data_publicacao', livro.data_publicacao)
    db.session.commit()
    return jsonify({'mensagem': 'Livro atualizado com sucesso'}), 200

# Deletar livro
@app.route('/livros/<int:livro_id>', methods=['DELETE'])
@jwt_required()
def deletar_livro(livro_id):
    user = get_jwt_identity()
    if user['role'] != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'mensagem': 'Livro não encontrado'}), 404
    db.session.delete(livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro deletado com sucesso'}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)

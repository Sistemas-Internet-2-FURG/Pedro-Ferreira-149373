from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from models import db, Autor, Livro, Usuario, autores_primarios, autores_secundarios
from config import Config
from sqlalchemy.orm import aliased

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'chave_super_secreta' 
db.init_app(app)

try:
    with app.app_context():
        db.create_all()
except Exception as e:
    print(f"Erro ao conectar ao banco de dados: {str(e)}")

# Tela inicial com opções de login
@app.route('/')
def home():
    return render_template('login.html')

# Página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        usuario = Usuario.query.filter_by(username=username, password=password).first()
        
        if usuario:
            session['user_type'] = usuario.role
            # Debugging print statement
            print(f"Usuário logado: {usuario.username}, Tipo: {session['user_type']}")
            
            if usuario.role == 'administrador':
                return redirect(url_for('dashboard_funcionario'))
            elif usuario.role == 'leitor':
                return redirect(url_for('dashboard_usuario'))
        return 'Credenciais inválidas. Tente novamente.'
    return render_template('login.html')


# Rota para registro de novos usuários
@app.route('/register', methods=['POST'])
def register():
    username = request.form['new_username']
    password = request.form['new_password']
    role = request.form['new_role']
    
    usuario_existente = Usuario.query.filter_by(username=username).first()
    if usuario_existente:
        return 'Usuário já existe.'
    
    novo_usuario = Usuario(username=username, password=password, role=role)
    db.session.add(novo_usuario)
    db.session.commit()
    
    # Após o registro, redireciona para a página de login
    return redirect(url_for('home'))

# Logout
@app.route('/logout')
def logout():
    session.pop('user_type', None)
    return redirect(url_for('home'))

# Dashboard para funcionários
@app.route('/funcionario')
def dashboard_funcionario():
    if session.get('user_type') == 'administrador':
        return render_template('index.html', role='administrador')
    return redirect(url_for('home'))

# Dashboard para usuários
@app.route('/usuario')
def dashboard_usuario():
    if session.get('user_type') == 'leitor':
        return render_template('index.html', role='leitor')
    return redirect(url_for('home'))


# Rota para criar um novo autor
@app.route('/autores', methods=['POST'])
def criar_autor():
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    dados = request.get_json()
    novo_autor = Autor(nome=dados['nome'], nacionalidade=dados['nacionalidade'], data_nascimento=dados['data_nascimento'])
    db.session.add(novo_autor)
    db.session.commit()
    return jsonify({'mensagem': 'Autor criado com sucesso'}), 201

# Rota para listar todos os autores
@app.route('/autores', methods=['GET'])
def listar_autores():
    autores = Autor.query.all()
    resultado = [{'id': autor.id, 'nome': autor.nome, 'nacionalidade': autor.nacionalidade, 'data_nascimento': autor.data_nascimento} for autor in autores]
    return jsonify(resultado)

# Rota para atualizar um autor
@app.route('/autores/<int:autor_id>', methods=['PUT'])
def atualizar_autor(autor_id):
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    dados = request.get_json()
    autor = Autor.query.get(autor_id)
    if not autor:
        return jsonify({'mensagem': 'Autor não encontrado'}), 404
    autor.nome = dados.get('nome', autor.nome)
    autor.nacionalidade = dados.get('nacionalidade', autor.nacionalidade)
    autor.data_nascimento = dados.get('data_nascimento', autor.data_nascimento)
    db.session.commit()
    return jsonify({'mensagem': 'Autor atualizado com sucesso'}), 200

# Rota para deletar um autor
@app.route('/autores/<int:autor_id>', methods=['DELETE'])
def deletar_autor(autor_id):
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    autor = Autor.query.get(autor_id)
    if not autor:
        return jsonify({'mensagem': 'Autor não encontrado'}), 404
    db.session.delete(autor)
    db.session.commit()
    return jsonify({'mensagem': 'Autor deletado com sucesso'}), 200

# Rota para criar um novo livro
@app.route('/livros', methods=['POST'])
def criar_livro():
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    dados = request.get_json()
    titulo = dados.get('titulo')
    genero = dados.get('genero')
    data_publicacao = dados.get('data_publicacao')
    localizacao = dados.get('localizacao')
    idioma = dados.get('idioma')
    tipo_obra = dados.get('tipo_obra')
    ids_primarios = dados.get('autores_primarios', [])
    ids_secundarios = dados.get('autores_secundarios', [])

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



@app.route('/livros', methods=['GET'])
def listar_livros():
    titulo = request.args.get('titulo')
    nome_autor = request.args.get('nome_autor')
    genero = request.args.get('genero')
    data_publicacao = request.args.get('data_publicacao')
    localizacao = request.args.get('localizacao')
    idioma = request.args.get('idioma')
    tipo_obra = request.args.get('tipo_obra')

    query = Livro.query

    if titulo:
        query = query.filter(Livro.titulo.contains(titulo))
    if genero:
        query = query.filter(Livro.genero.contains(genero))
    if data_publicacao:
        query = query.filter(Livro.data_publicacao.contains(data_publicacao))
    if localizacao:
        query = query.filter(Livro.localizacao.contains(localizacao))
    if idioma:
        query = query.filter(Livro.idioma.contains(idioma))
    if tipo_obra:
        query = query.filter(Livro.tipo_obra.contains(tipo_obra))

    livros = query.all()

    if nome_autor:
        livros_primarios = [livro for livro in livros if any(autor.nome == nome_autor for autor in livro.autores_primarios)]
        livros_secundarios = [livro for livro in livros if any(autor.nome == nome_autor for autor in livro.autores_secundarios)]
        resultado = {
            'livros_primarios': [{
                'id': livro.id,
                'titulo': livro.titulo,
                'genero': livro.genero,
                'data_publicacao': livro.data_publicacao,
                'localizacao': livro.localizacao,
                'idioma': livro.idioma,
                'tipo_obra': livro.tipo_obra,
            } for livro in livros_primarios],
            'livros_secundarios': [{
                'id': livro.id,
                'titulo': livro.titulo,
                'genero': livro.genero,
                'data_publicacao': livro.data_publicacao,
                'localizacao': livro.localizacao,
                'idioma': livro.idioma,
                'tipo_obra': livro.tipo_obra,
            } for livro in livros_secundarios]
        }
    else:
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

    return jsonify(resultado)


# Rota para atualizar um livro
@app.route('/livros/<int:livro_id>', methods=['PUT'])
def atualizar_livro(livro_id):
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    dados = request.get_json()
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'mensagem': 'Livro não encontrado'}), 404
    livro.titulo = dados.get('titulo', livro.titulo)
    livro.genero = dados.get('genero', livro.genero)
    livro.data_publicacao = dados.get('data_publicacao', livro.data_publicacao)
    db.session.commit()
    return jsonify({'mensagem': 'Livro atualizado com sucesso'}), 200

# Rota para obter detalhes de um livro específico
@app.route('/livros/<int:livro_id>', methods=['GET'])
def detalhes_livro(livro_id):
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'mensagem': 'Livro não encontrado'}), 404
    
    detalhes = {
        'id': livro.id,
        'titulo': livro.titulo,
        'genero': livro.genero,
        'data_publicacao': livro.data_publicacao,
        'localizacao': livro.localizacao,
        'idioma': livro.idioma,
        'tipo_obra': livro.tipo_obra,
        'autores_primarios': [{'id': autor.id, 'nome': autor.nome} for autor in livro.autores_primarios],
        'autores_secundarios': [{'id': autor.id, 'nome': autor.nome} for autor in livro.autores_secundarios]
    }
    
    return jsonify(detalhes)

# Rota para deletar um livro
@app.route('/livros/<int:livro_id>', methods=['DELETE'])
def deletar_livro(livro_id):
    if session.get('user_type') != 'administrador':
        return jsonify({'mensagem': 'Acesso negado'}), 403
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'mensagem': 'Livro não encontrado'}), 404
    db.session.delete(livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro deletado com sucesso'}), 200

if __name__ == '__main__':
    app.run(debug=True)

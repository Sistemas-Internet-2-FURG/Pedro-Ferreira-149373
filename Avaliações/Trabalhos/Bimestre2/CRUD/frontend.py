from flask import Flask, render_template, redirect, url_for, request, session
import requests

app = Flask(__name__)
app.secret_key = 'chave_super_secreta'

API_URL = "http://127.0.0.1:5000"  # URL base para a API na porta 5000

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'access_token' in session:
        role = session.get('role')
        return redirect(url_for('admin_dashboard' if role == 'administrador' else 'user_dashboard'))
    return render_template('login.html')

@app.route('/admin')
def admin_dashboard():
    if 'access_token' not in session or session.get('role') != 'administrador':
        return redirect(url_for('login'))
    return render_template('admin.html')

@app.route('/user')
def user_dashboard():
    if 'access_token' not in session or session.get('role') != 'leitor':
        return redirect(url_for('login'))
    return render_template('user.html')

@app.route('/logout')
def logout():
    session.pop('access_token', None)
    session.pop('role', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(port=5001, debug=True)

const apiBaseUrl = 'http://localhost:5000';
let jwtToken = localStorage.getItem("jwtToken");

// Verifica se o token JWT está presente no localStorage
if (!jwtToken) {
    console.warn("Token JWT não encontrado. Redirecionando para login.");
    window.location.href = '/login';
} else {
    console.log("Token JWT encontrado. Acesso autorizado.");
}

// Função de logout
document.getElementById("logout-button").onclick = () => {
    localStorage.removeItem("jwtToken");
    console.log("Token removido. Redirecionando para a página de login.");
    window.location.href = "/login";
};

// Adicionar Autor
document.getElementById("add-autor-button").onclick = async () => {
    const nome = document.getElementById("autor-nome").value;
    const nacionalidade = document.getElementById("autor-nacionalidade").value;
    const data_nascimento = document.getElementById("autor-data").value;

    console.log("Tentativa de adicionar autor:", { nome, nacionalidade, data_nascimento });

    try {
        const response = await fetch(`${apiBaseUrl}/autores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ nome, nacionalidade, data_nascimento })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(data.mensagem || "Autor adicionado com sucesso.");
            listarAutores();
        } else {
            alert(`Erro ao adicionar autor: ${data.mensagem || 'Problema ao processar dados no servidor'}`);
            console.log("Detalhes do erro:", data); // Para depuração
        }
    } catch (error) {
        console.error("Erro ao adicionar autor:", error);
        alert("Erro de conexão ao adicionar autor.");
    }
};

// Listar Autores
async function listarAutores() {
    console.log("Listando autores...");

    try {
        const response = await fetch(`${apiBaseUrl}/autores`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const listaAutores = document.getElementById("lista-autores");
        listaAutores.innerHTML = "";

        const data = await response.json();

        if (response.ok) {
            data.forEach(autor => {
                const li = document.createElement("li");
                li.innerHTML = `ID: ${autor.id}, Nome: ${autor.nome}, Nacionalidade: ${autor.nacionalidade}`;
                listaAutores.appendChild(li);
            });
            console.log("Autores listados com sucesso.");
        } else {
            alert(`Erro ao listar autores: ${data.mensagem || 'Problema ao processar dados no servidor'}`);
            console.log("Detalhes do erro:", data); // Para depuração
        }
    } catch (error) {
        console.error("Erro ao listar autores:", error);
        alert("Erro de conexão ao listar autores.");
    }
}

// Adicionar Livro
document.getElementById("add-livro-button").onclick = async () => {
    const titulo = document.getElementById("livro-titulo").value;
    const genero = document.getElementById("livro-genero").value;
    const data_publicacao = document.getElementById("livro-data").value;
    const localizacao = document.getElementById("livro-localizacao").value;
    const idioma = document.getElementById("livro-idioma").value;
    const tipo_obra = document.getElementById("livro-tipo").value;
    const autores_primarios = document.getElementById("livro-autores-primarios").value.split(',').map(id => id.trim());
    const autores_secundarios = document.getElementById("livro-autores-secundarios").value.split(',').map(id => id.trim());

    console.log("Tentativa de adicionar livro:", { titulo, genero, data_publicacao, localizacao, idioma, tipo_obra, autores_primarios, autores_secundarios });

    try {
        const response = await fetch(`${apiBaseUrl}/livros`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                titulo,
                genero,
                data_publicacao,
                localizacao,
                idioma,
                tipo_obra,
                autores_primarios,
                autores_secundarios
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(data.mensagem || "Livro adicionado com sucesso.");
            listarLivros();
        } else {
            alert(data.mensagem || `Erro ao adicionar livro. Código: ${response.status}`);
            console.log("Detalhes do erro:", data); // Para depuração
        }
    } catch (error) {
        console.error("Erro ao adicionar livro:", error);
        alert("Erro de conexão ao adicionar livro.");
    }
};

// Listar Livros
async function listarLivros() {
    console.log("Listando livros...");

    try {
        const response = await fetch(`${apiBaseUrl}/livros`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const listaLivros = document.getElementById("lista-livros");
        listaLivros.innerHTML = "";

        const data = await response.json();

        if (response.ok) {
            data.forEach(livro => {
                const li = document.createElement("li");
                li.innerHTML = `ID: ${livro.id}, Título: ${livro.titulo}, Gênero: ${livro.genero}, Data de Publicação: ${livro.data_publicacao}`;
                listaLivros.appendChild(li);
            });
            console.log("Livros listados com sucesso.");
        } else {
            alert(`Erro ao listar livros. Código: ${response.status}`);
            console.log("Detalhes do erro:", data); // Para depuração
        }
    } catch (error) {
        console.error("Erro ao listar livros:", error);
        alert("Erro de conexão ao listar livros.");
    }
}

// Inicializar listagens de autores e livros ao carregar a página
window.onload = () => {
    listarAutores();
    listarLivros();
};

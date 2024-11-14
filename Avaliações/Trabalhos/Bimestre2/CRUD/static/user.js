const apiBaseUrl = 'http://localhost:5000';
let jwtToken = localStorage.getItem("jwtToken");

// Função de logout
document.getElementById("logout-button").onclick = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
};

// Buscar livros por título
document.getElementById("buscar-livros").onclick = async () => {
    const titulo = document.getElementById("busca-titulo").value;

    try {
        const response = await fetch(`${apiBaseUrl}/livros?titulo=${encodeURIComponent(titulo)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const listaLivros = document.getElementById("lista-livros");
        listaLivros.innerHTML = "";
        const data = await response.json();

        if (data.length === 0) {
            listaLivros.innerHTML = "<li>Nenhum livro encontrado.</li>";
        } else {
            data.forEach(livro => {
                const li = document.createElement("li");
                li.innerHTML = `ID: ${livro.id}, Título: ${livro.titulo}, Gênero: ${livro.genero}, Data de Publicação: ${livro.data_publicacao}`;
                listaLivros.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
    }
};

// Listar todos os livros
document.getElementById("listar-livros").onclick = async () => {
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

        data.forEach(livro => {
            const li = document.createElement("li");
            li.innerHTML = `ID: ${livro.id}, Título: ${livro.titulo}, Gênero: ${livro.genero}, Data de Publicação: ${livro.data_publicacao}`;
            listaLivros.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao listar livros:", error);
    }
};

// Inicializar listagem de todos os livros ao carregar a página
window.onload = () => {
    listarLivros();
};

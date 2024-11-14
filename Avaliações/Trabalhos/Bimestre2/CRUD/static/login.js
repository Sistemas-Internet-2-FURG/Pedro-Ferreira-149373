const apiBaseUrl = 'http://127.0.0.1:5000'; // Confirme que a API está rodando neste endereço

// Função para realizar login
document.querySelector('.login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o recarregamento da página ao submeter

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Iniciando o login para o usuário:", username);

    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (response.ok) {
            console.log("Login bem-sucedido. Armazenando token JWT...");

            // Armazenar o token JWT no localStorage
            localStorage.setItem('jwtToken', data.access_token);

            // Decodificar o payload do JWT para obter as informações do usuário
            const tokenPayloadBase64 = data.access_token.split('.')[1];
            const tokenPayloadJson = atob(tokenPayloadBase64);
            const tokenPayload = JSON.parse(tokenPayloadJson);

            const userRole = tokenPayload.role;
            console.log("Role do usuário:", userRole);

            // Verificar e redirecionar com base na função do usuário
            if (userRole === 'administrador') {
                window.location.href = '/admin';
            } else if (userRole === 'leitor') {
                window.location.href = '/user';
            } else {
                console.error("Função do usuário desconhecida:", userRole);
                alert("Função de usuário inválida. Contate o administrador.");
            }
        } else {
            alert(data.mensagem || "Falha ao fazer login");
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar-se ao servidor. Tente novamente mais tarde.");
    }
});

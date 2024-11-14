document.getElementById("register-button").addEventListener("click", async function () {
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const role = document.getElementById("new-role").value;

    try {
        const response = await fetch(`${apiBaseUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registro bem-sucedido! Faça login agora.");
            // Redirecionar para o login
            document.querySelector(".login-form").classList.remove("hidden");
            document.querySelector(".register-form").classList.add("hidden");
            document.getElementById("form-title").textContent = "Login na Biblioteca";
        } else {
            alert(data.mensagem || "Erro ao registrar usuário.");
        }
    } catch (error) {
        console.error("Erro ao registrar:", error);
        alert("Erro de conexão ao registrar.");
    }
});

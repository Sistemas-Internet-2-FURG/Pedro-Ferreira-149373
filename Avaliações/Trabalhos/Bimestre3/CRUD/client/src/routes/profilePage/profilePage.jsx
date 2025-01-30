import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Função para remover um anúncio
  const handleRemovePost = async (postId) => {
    try {
      await apiRequest.delete(`/posts/${postId}`); // Faz a requisição para deletar
      navigate(0); // Atualiza a página para refletir a mudança
    } catch (err) {
      console.log("Erro ao remover o anúncio:", err);
    }
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Informação do Usuário</h1>
            <Link to="/profile/update">
              <button>Atualizar Perfil</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="Avatar" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Sair</button>
          </div>

          {/* Meus Anúncios */}
          <div className="title">
            <h1>Meus Anúncios</h1>
            <Link to="/add">
              <button>Novo Anúncio</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>❌ Erro ao carregar anúncios!</p>}
            >
              {(postResponse) => {
                console.log("✅ Meus Anúncios carregados:", postResponse.data.userPosts);
                return <List posts={postResponse.data.userPosts} onRemovePost={handleRemovePost} />;
              }}
            </Await>
          </Suspense>

          {/* Lista de Salvos */}
          <div className="title">
            <h1>Salvos</h1>
          </div>
          <Suspense fallback={<p>Carregando...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>❌ Erro ao carregar anúncios salvos!</p>}
            >
              {(postResponse) => {
                console.log("✅ Anúncios salvos carregados:", postResponse.data.savedPosts);
                return <List posts={postResponse.data.savedPosts} />;
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat */}
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<p>Carregando...</p>}>
          <Await
            resolve={data.chatResponse}
            errorElement={<p>❌ Erro ao carregar chats! Verifique o console.</p>}
          >
            {(chatResponse) => {
              console.log("✅ Chats recebidos:", chatResponse);

              // Ajustando para acessar os dados corretamente
              const chats = chatResponse.data; 

              // Validação para evitar erro caso não haja chats
              if (!chats || chats.length === 0) {
                return <p>Nenhuma conversa encontrada.</p>;
              }

              return <Chat chats={chats} />;
            }}
          </Await>
        </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

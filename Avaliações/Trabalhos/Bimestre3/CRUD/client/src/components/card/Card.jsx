import { useState } from "react";
import { Link } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";
import Chat from "../../components/chat/Chat"; // ✅ Importando o chat para exibir dentro do Card

function Card({ item, onRemovePost }) {
  const [chat, setChat] = useState(null); // ✅ Estado para armazenar o chat

  // Função para iniciar um chat com o proprietário do anúncio
  const handleChat = async () => {
    try {
      const response = await apiRequest.post("/chats", {
        receiverId: item.userId, // ID do dono do anúncio
      });

      console.log("✅ Chat criado ou encontrado:", response.data);

      // Pega os dados do chat retornado pela API
      const chatData = response.data;

      if (!chatData) {
        console.error("❌ Erro: Nenhum chat retornado!");
        return;
      }

      setChat(chatData); // ✅ Define o chat para exibição dentro do Card
    } catch (error) {
      console.error("❌ Erro ao iniciar o chat:", error);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">R$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} quartos</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} banheiros</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon" onClick={handleChat} style={{ cursor: "pointer" }}>
              <img src="/chat.png" alt="Abrir Chat" />
            </div>
          </div>
        </div>

        {/* Se o chat foi iniciado, exibe a interface do chat */}
        {chat && (
          <div className="chatContainer">
            <div className="wrapper">
              <Chat chats={[chat]} /> {/* ✅ Exibindo o chat dentro do Card */}
              <button onClick={() => setChat(null)} className="closeChat">Fechar Chat</button>
            </div>
          </div>
        )}

        {/* Botão de remover apenas se `onRemovePost` for passado */}
        {onRemovePost && (
          <button onClick={() => onRemovePost(item.id)} className="remove-btn">
            Remover Anúncio
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;

import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Encontre a Casa dos Seus Sonhos</h1>
          <p>
            Conectamos você às melhores oportunidades imobiliárias no Sul do Rio Grande do Sul. 
            Atendemos Rio Grande, Pelotas, São Lourenço do Sul e região, garantindo qualidade, 
            segurança e as melhores opções para você e sua família. 
          </p>
          <p>
            Explore agora e encontre o lar perfeito para viver momentos inesquecíveis!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>+10</h1>
              <h2>Anos de Experiência</h2>
            </div>
            <div className="box">
              <h1>14.435</h1>
              <h2>Anúncios Feitos</h2>
            </div>
            <div className="box">
              <h1>+200</h1>
              <h2>Propriedades Vendidas ou Alugadas</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;

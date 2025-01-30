import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Localização</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Cidade"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Tipo</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">Qualquer</option>
            <option value="buy">Vender</option>
            <option value="rent">Alugar</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Propriedade</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">Qualquer</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="condo">Casa de Condomínio</option>
            <option value="land">Terreno</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Preço Mín.</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Qualquer"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Preço Máx.</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="Qualquer"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Quarto</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Qualquer"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;

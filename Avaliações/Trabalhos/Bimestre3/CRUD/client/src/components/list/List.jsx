import "./list.scss";
import Card from "../card/Card";

function List({ posts, onRemovePost }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} onRemovePost={onRemovePost} />
      ))}
    </div>
  );
}

export default List;

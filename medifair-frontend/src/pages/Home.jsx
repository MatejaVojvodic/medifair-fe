import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Product Management</h1>
      <Link to="/create">Create Product</Link>
      <ProductList />
    </div>
  );
};

export default Home;

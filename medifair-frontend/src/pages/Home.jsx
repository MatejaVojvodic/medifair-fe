import ProductList from "../components/ProductList";
import ProductFilter from "../components/ProductFilter.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Product Management</h1>
      <Link to="/create">Create Product</Link>
      <ProductFilter />
      <ProductList />
    </div>
  );
};

export default Home;

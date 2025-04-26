import ProductList from "../components/ProductList";
import ProductFilter from "../components/ProductFilter.jsx";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Add Navbar */}
      <div className="container">
      <h1>Product Management</h1>
      <Link to="/create">Create Product</Link>
      <ProductFilter />
      <ProductList />
      </div>
    </div>
  );
};

export default Home;

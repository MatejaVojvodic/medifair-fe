import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productService";
import "../assets/styles/product.css";

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (product) => {
    await createProduct(product);
    navigate("/");
  };

  return (
    <div>
      <h2>Create Product</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProduct;

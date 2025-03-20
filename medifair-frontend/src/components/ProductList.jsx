import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const { products, handleDeleteProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ cursor: "pointer", marginBottom: "10px" }}>
          <strong onClick={() => navigate(`/products/${product.id}`)}>{product.name}</strong> - ${product.price} <br />
          <button onClick={() => navigate(`/edit/${product.id}`)}>Edit</button>
          <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

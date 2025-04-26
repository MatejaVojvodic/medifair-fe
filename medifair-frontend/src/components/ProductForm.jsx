import { useState } from "react";
import "../assets/styles/product.css";

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [product, setProduct] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    quantity: initialData.quantity || "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required />
      <input name="description" value={product.description} onChange={handleChange} placeholder="Description" required />
      <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required />
      <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;

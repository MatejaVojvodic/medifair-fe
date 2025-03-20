import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { getProductById, updateProduct } from "../api/productService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => {
      console.log("Editing Product Data:", data); 
      setProduct(data);
    }).catch((error) => {
      console.error("Error fetching product:", error);
    });
  }, [id]);

  const handleSubmit = async (updatedProduct) => {
    console.log("Submitting Update:", updatedProduct);
    await updateProduct(id, updatedProduct);
    navigate("/");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <ProductForm onSubmit={handleSubmit} initialData={product} />
    </div>
  );
};

export default EditProduct;


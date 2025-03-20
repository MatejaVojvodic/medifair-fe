import { createContext, useState, useEffect } from "react";
import { getAllProducts, createProduct ,updateProduct, deleteProduct } from "../api/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const handleAddProduct = async (product) => {
    await createProduct(product);
    const updatedProducts = await getAllProducts(); 
    setProducts(updatedProducts);
  };

  const handleUpdateProduct = async (id, updatedData) => {
    await updateProduct(id, updatedData);
    const updatedProducts = await getAllProducts();
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    const updatedProducts = await getAllProducts();
    setProducts(updatedProducts);
  };

  return (
    <ProductContext.Provider value={{ products, handleAddProduct, handleUpdateProduct, handleDeleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

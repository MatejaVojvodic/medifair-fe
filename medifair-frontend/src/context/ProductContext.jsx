import { createContext, useState, useEffect } from "react";
import { getAllProducts, createProduct ,updateProduct, deleteProduct, filterProducts } from "../api/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "", minQuantity: "", maxQuantity: "" });

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

  const applyFilters = async () => {
    const response = await filterProducts(filters);
    setProducts(response);
  };

  return (
    <ProductContext.Provider value={{ products, handleAddProduct, handleUpdateProduct, handleDeleteProduct, filters, setFilters, applyFilters }}>
      {children}
    </ProductContext.Provider>
  );
};

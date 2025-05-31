import { createContext, useState, useEffect } from "react"
import { getAllProducts, createProduct, updateProduct, deleteProduct, filterProducts } from "../api/productService"

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "", minQuantity: "", maxQuantity: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError("")
      const productsData = await getAllProducts()
      setProducts(productsData)
    } catch (err) {
      setError("Failed to load products. Please check if the backend is running.")
      console.error("Error loading products:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (product) => {
    try {
      setError("")
      await createProduct(product)
      await loadProducts() // Reload products after adding
    } catch (err) {
      setError("Failed to create product")
      console.error("Error creating product:", err)
      throw err
    }
  }

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      setError("")
      await updateProduct(id, updatedData)
      await loadProducts() // Reload products after updating
    } catch (err) {
      setError("Failed to update product")
      console.error("Error updating product:", err)
      throw err
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      setError("")
      await deleteProduct(id)
      await loadProducts() // Reload products after deleting
    } catch (err) {
      setError("Failed to delete product")
      console.error("Error deleting product:", err)
      throw err
    }
  }

  const applyFilters = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await filterProducts(filters)
      setProducts(response)
    } catch (err) {
      setError("Failed to filter products")
      console.error("Error filtering products:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        filters,
        setFilters,
        applyFilters,
        isLoading,
        error,
        loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

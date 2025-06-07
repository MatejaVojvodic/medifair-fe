// import { createContext, useState, useEffect, useContext } from "react"
// import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../api/cartService"
// import { useAuth } from "./AuthContext"

// const CartContext = createContext()

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({ items: [], totalPrice: 0 })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const { isLoggedIn } = useAuth()

//   // Load cart when user is logged in
//   useEffect(() => {
//     if (isLoggedIn) {
//       loadCart()
//     } else {
//       setCart({ items: [], totalPrice: 0 })
//     }
//   }, [isLoggedIn])

//   const loadCart = async () => {
//     try {
//       setIsLoading(true)
//       setError("")
//       const cartData = await getCart()
//       setCart(cartData)
//     } catch (err) {
//       setError("Failed to load cart")
//       console.error("Error loading cart:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleAddToCart = async (productId, quantity = 1) => {
//     try {
//       setIsLoading(true)
//       setError("")
//       const updatedCart = await addToCart({ productId, quantity })
//       setCart(updatedCart)
//       return { success: true }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to add item to cart"
//       setError(errorMessage)
//       console.error("Error adding to cart:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleUpdateCartItem = async (productId, quantity) => {
//     try {
//       setIsLoading(true)
//       setError("")
//       const updatedCart = await updateCartItem(productId, quantity)
//       setCart(updatedCart)
//       return { success: true }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to update cart item"
//       setError(errorMessage)
//       console.error("Error updating cart item:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRemoveFromCart = async (productId) => {
//     try {
//       setIsLoading(true)
//       setError("")
//       await removeFromCart(productId)
//       await loadCart() // Reload cart after removal
//       return { success: true }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to remove item from cart"
//       setError(errorMessage)
//       console.error("Error removing from cart:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleClearCart = async () => {
//     try {
//       setIsLoading(true)
//       setError("")
//       await clearCart()
//       setCart({ items: [], totalPrice: 0 })
//       return { success: true }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || "Failed to clear cart"
//       setError(errorMessage)
//       console.error("Error clearing cart:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getCartItemCount = () => {
//     return cart.items.reduce((total, item) => total + item.quantity, 0)
//   }

//   const value = {
//     cart,
//     isLoading,
//     error,
//     loadCart,
//     addToCart: handleAddToCart,
//     updateCartItem: handleUpdateCartItem,
//     removeFromCart: handleRemoveFromCart,
//     clearCart: handleClearCart,
//     getCartItemCount,
//   }

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>
// }

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }

import { createContext, useState, useEffect, useContext } from "react"
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../api/cartService.js"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { isLoggedIn } = useAuth()

  // Load cart when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadCart()
    } else {
      setCart({ items: [], totalPrice: 0 })
    }
  }, [isLoggedIn])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      setError("")
      const cartData = await getCart()
      setCart(cartData)
    } catch (err) {
      setError("Failed to load cart")
      console.error("Error loading cart:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      setIsLoading(true)
      setError("")
      const updatedCart = await addToCart({ productId, quantity })
      setCart(updatedCart)
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add item to cart"
      setError(errorMessage)
      console.error("Error adding to cart:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCartItem = async (productId, quantity) => {
    try {
      setIsLoading(true)
      setError("")
      const updatedCart = await updateCartItem(productId, quantity)
      setCart(updatedCart)
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update cart item"
      setError(errorMessage)
      console.error("Error updating cart item:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      setIsLoading(true)
      setError("")
      await removeFromCart(productId)
      await loadCart() // Reload cart after removal
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to remove item from cart"
      setError(errorMessage)
      console.error("Error removing from cart:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCart = async () => {
    try {
      setIsLoading(true)
      setError("")
      await clearCart()
      setCart({ items: [], totalPrice: 0 })
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to clear cart"
      setError(errorMessage)
      console.error("Error clearing cart:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart,
    isLoading,
    error,
    loadCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
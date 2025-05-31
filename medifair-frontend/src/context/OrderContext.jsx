import { createContext, useState, useContext } from "react"
import { checkout, getUserOrders, getOrderById } from "../api/orderService"
import { useAuth } from "./AuthContext"

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { isLoggedIn } = useAuth()

  const handleCheckout = async (shippingAddress) => {
    try {
      setIsLoading(true)
      setError("")
      const order = await checkout({ shippingAddress })
      return { success: true, order }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Checkout failed"
      setError(errorMessage)
      console.error("Error during checkout:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserOrders = async () => {
    if (!isLoggedIn) return

    try {
      setIsLoading(true)
      setError("")
      const ordersData = await getUserOrders()
      setOrders(ordersData)
    } catch (err) {
      setError("Failed to load orders")
      console.error("Error loading orders:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getOrder = async (orderId) => {
    try {
      setIsLoading(true)
      setError("")
      const order = await getOrderById(orderId)
      return { success: true, order }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load order"
      setError(errorMessage)
      console.error("Error loading order:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    orders,
    isLoading,
    error,
    checkout: handleCheckout,
    loadUserOrders,
    getOrder,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

const CartIcon = () => {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Link to="/cart" className="cart-icon-link">
      <div className="cart-icon">🛒{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}</div>
    </Link>
  )
}

export default CartIcon
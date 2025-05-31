// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Home from "../pages/Home";
// import ProductDetail from "../pages/ProductDetail";
// import CreateProduct from "../pages/CreateProduct";
// import EditProduct from "../pages/EditProduct";
// import Login from "../pages/Login";
// import Register from "../pages/Register";

// // Protected route component
// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn, isLoading } = useAuth();
  
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
  
//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
      
//       {/* Protected routes */}
//       <Route path="/" element={
//         <ProtectedRoute>
//           <Home />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/products/:id" element={
//         <ProtectedRoute>
//           <ProductDetail />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/create" element={
//         <ProtectedRoute>
//           <CreateProduct />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/edit/:id" element={
//         <ProtectedRoute>
//           <EditProduct />
//         </ProtectedRoute>
//       } />
//     </Routes>
//   );
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Home from "../pages/Home"
import ProductDetail from "../pages/ProductDetail"
import CreateProduct from "../pages/CreateProduct"
import EditProduct from "../pages/EditProduct"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Cart from "../pages/Cart"
import Checkout from "../pages/Checkout"
import OrderSuccess from "../pages/OrderSuccess"
import Orders from "../pages/Orders"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      {/* Cart and Order routes - temporarily commented out */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes

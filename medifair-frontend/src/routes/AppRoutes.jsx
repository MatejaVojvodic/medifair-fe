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
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import CreateProduct from "../pages/CreateProduct"
import EditProduct from "../pages/EditProduct"
import ProductDetail from "../pages/ProductDetail"
import Cart from "../pages/Cart"
import Checkout from "../pages/Checkout"
import OrderSuccess from "../pages/OrderSuccess"
import Orders from "../pages/Orders"
import Profile from "../pages/Profile"
import Chat from "../pages/Chat"

const AppRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {isLoggedIn && <Navbar />}
      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" />} />

          {/* Protected routes */}
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/create" element={isLoggedIn ? <CreateProduct /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={isLoggedIn ? <EditProduct /> : <Navigate to="/login" />} />
          <Route path="/products/:id" element={isLoggedIn ? <ProductDetail /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/order-success" element={isLoggedIn ? <OrderSuccess /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
        </Routes>
      </div>
    </>
  )
}

export default AppRoutes


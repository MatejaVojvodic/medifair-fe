// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import ProductDetail from "../pages/ProductDetail";
// import CreateProduct from "../pages/CreateProduct";
// import EditProduct from "../pages/EditProduct";
// import Login from "../pages/Login";
// import Register from "../pages/Register";

// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/products/:id" element={<ProductDetail />} />
//         <Route path="/create" element={<CreateProduct />} />
//         <Route path="/edit/:id" element={<EditProduct />} />
//         <Route path="/login" element={<Login />} /> 
//         <Route path="/register" element={<Register />} /> 
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;

// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import CreateProduct from "../pages/CreateProduct";
import EditProduct from "../pages/EditProduct";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/products/:id" element={
        <ProtectedRoute>
          <ProductDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/create" element={
        <ProtectedRoute>
          <CreateProduct />
        </ProtectedRoute>
      } />
      
      <Route path="/edit/:id" element={
        <ProtectedRoute>
          <EditProduct />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;

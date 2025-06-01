

// src/App.jsx
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";
// import { ProductProvider } from "./context/ProductContext";
// import { AuthProvider } from "./context/AuthContext";
// import "./assets/styles/auth.css"; 
// import "./assets/styles/product.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <ProductProvider>
//           <AppRoutes />
//         </ProductProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


// import { BrowserRouter } from "react-router-dom"
// import AppRoutes from "./routes/AppRoutes"
// import { ProductProvider } from "./context/ProductContext"
// import { AuthProvider } from "./context/AuthContext"
// import { CartProvider } from "./context/CartContext"
// import { OrderProvider } from "./context/OrderContext"
// import "./assets/styles/auth.css"
// import "./assets/styles/product.css"

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <ProductProvider>
//           <CartProvider>
//             <OrderProvider>
//               <AppRoutes />
//             </OrderProvider>
//           </CartProvider>
//         </ProductProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { ProductProvider } from "./context/ProductContext"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { OrderProvider } from "./context/OrderContext"
import "./assets/styles/auth.css"
import "./assets/styles/product.css"
import "./assets/styles/product-detail.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <AppRoutes />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App



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

import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProductProvider } from "./context/ProductContext"
import { CartProvider } from "./context/CartProvider"
import { OrderProvider } from "./context/OrderContext"
import { ChatProvider } from "./context/ChatContext"
import AppRoutes from "./routes/AppRoutes"
import "./assets/styles/global.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <ChatProvider>
                <div className="App">
                  <AppRoutes />
                </div>
              </ChatProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App



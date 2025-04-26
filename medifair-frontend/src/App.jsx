// import AppRoutes from "./routes/AppRoutes";
// import { ProductProvider } from "./context/ProductContext";

// function App() {
//   return (
//     <ProductProvider>
//       <AppRoutes />
//     </ProductProvider>
//   );
// }

// export default App;

// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import "./assets/styles/auth.css"; // Import the CSS

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <AppRoutes />
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
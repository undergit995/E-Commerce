
import { Route, Routes } from "react-router-dom";
import Products,{CartProvider} from "./Component/Products/Products";
import Dashboard from "./Component/Dashboard/Dashboard";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import FormValid from "./Component/FormValid/FormValid";
import Layout from "./Component/Misc/Layout";
import Home from "./Component/Home/Home";
import Cart from "./Component/Cart/Cart";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<FormValid />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/cart"    element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/products"   element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="home"   element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
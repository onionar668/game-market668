import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import UserProfilePage from "./pages/UserProfilePage";
import MessagesPage from "./pages/MessagesPage";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import { useFavoriteStore } from "./store/useFavoriteStore";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
      fetchFavorites();
    }
  }, [isAuthenticated, fetchCart, fetchFavorites]);
  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300' data-theme={theme} >
     <NavBar />

     <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/user/:id" element={<UserProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
     </Routes>
     <Toaster/>
    </div>
  )
}

export default App

import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon, LogInIcon, LogOutIcon, MessageCircleIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelectro";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useFavoriteStore } from "../store/useFavoriteStore";

function NavBar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { getCartCount } = useCartStore();
  const { favorites } = useFavoriteStore();
  const cartCount = getCartCount();
  const favoritesCount = favorites.length;

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="navbar px-4 min-h-[4rem] justify-between">
        <div className="flex-1 lg:flex-none">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="size-9 text-primary" />
              <span className="font-semibold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                POSGRESTORE
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end max-w-xl">
          <SearchBar />
          <FilterBar />
          <Link
            to="/favorites"
            className="indicator btn btn-ghost btn-circle"
            title="Favorites"
          >
            <HeartIcon className="size-5" />
            {favoritesCount > 0 && (
              <span className="badge badge-sm badge-primary indicator-item">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="indicator btn btn-ghost btn-circle"
            title="Cart"
          >
            <ShoppingCartIcon className="size-5" />
            {cartCount > 0 && (
              <span className="badge badge-sm badge-primary indicator-item">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated() && (
            <Link to="/messages" className="btn btn-ghost btn-circle" title="Messages">
              <MessageCircleIcon className="size-5" />
            </Link>
          )}
          <ThemeSelector />
          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <Link to={`/user/${user?.id}`} className="text-sm hidden sm:inline hover:link">
                {user?.email}
              </Link>
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm"
                title="Logout"
              >
                <LogOutIcon className="size-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm" title="Sign In">
              <LogInIcon className="size-5" />
              <span className="hidden sm:inline ml-1">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;

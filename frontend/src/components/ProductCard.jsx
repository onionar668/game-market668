import { EditIcon, TrashIcon, ShoppingCartIcon, HeartIcon, UserIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useFavoriteStore } from "../store/useFavoriteStore";
import { useAuthStore } from "../store/useAuthStore";

function ProductCard({ product, showEditDelete = true }) {
  const { deleteProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavoriteStore();
  const { user, isAuthenticated } = useAuthStore();
  const inFavorites = isInFavorites(product.id);
  const author = product.User || product.user;
  const isAuthor = author && user && author.id === user.id;

  return (
    <div className="card w-86 h-85 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative pt-[50%]">
        <img
          src={product.img}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="text-primary text-lg">{product.name}</h2>
        <p className="text-accent text-xl font-bold">${Number(product.price).toFixed(2)}</p>
        {author && (
          <Link
            to={`/user/${author.id}`}
            className="flex items-center gap-1 text-sm text-base-content/70 hover:link"
          >
            <UserIcon className="size-4" />
            {author.email}
          </Link>
        )}
      </div>

      <div className="card-actions justify-end mb-4 mr-5 flex-wrap gap-2">
        <button
          onClick={() => addToCart(product)}
          className="btn rounded-2xl border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
          title="Add to cart"
        >
          <ShoppingCartIcon className="size-4" />
          <span className="hidden sm:inline">Cart</span>
        </button>
        <button
          onClick={() => (inFavorites ? removeFromFavorites(product.id) : addToFavorites(product))}
          className={`btn rounded-2xl ${
            inFavorites
              ? "border-error text-error bg-error/10 hover:bg-error hover:text-error-content"
              : "border-error text-error hover:bg-error hover:text-black"
          }`}
          title={inFavorites ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon className={`size-4 ${inFavorites ? "fill-current" : ""}`} />
        </button>
        {showEditDelete && isAuthor && (
          <>
            <Link
              to={`/product/${product.id}`}
              className="btn rounded-2xl border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
            >
              <EditIcon className="size-4" />
            </Link>
            <button
              onClick={() => deleteProduct(product.id)}
              className="btn border-red-500 text-red-500 rounded-2xl hover:bg-red-500 hover:text-black"
            >
              <TrashIcon className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

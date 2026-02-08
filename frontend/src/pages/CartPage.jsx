import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { ShoppingCartIcon, TrashIcon, MinusIcon, PlusIcon } from "lucide-react";

function CartPage() {
  const {
    cartItems,
    fetchCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getCartCount,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const getProduct = (item) => item.Product || item.product;
  const getItemId = (item) => item.id || item.productId;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-base-100 p-8 rounded-full">
            <ShoppingCartIcon className="size-16 text-base-content/30" />
          </div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-base-content/70">Add some products to get started</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCartIcon className="size-8" />
        Cart ({getCartCount()} items)
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = getProduct(item);
          if (!product) return null;
          const qty = item.quantity || 1;
          return (
            <div
              key={getItemId(item)}
              className="card bg-base-100 shadow flex-row gap-4 p-4"
            >
              <figure className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-primary font-bold">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => updateQuantity(getItemId(item), Math.max(1, qty - 1))}
                >
                  <MinusIcon className="size-4" />
                </button>
                <span className="w-8 text-center">{qty}</span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => updateQuantity(getItemId(item), qty + 1)}
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={() => removeFromCart(getItemId(item))}
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="card bg-base-100 shadow mt-8 p-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${getTotalPrice().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useFavoriteStore } from "../store/useFavoriteStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, UserIcon, MessageCircleIcon } from "lucide-react";

function ProductPage() {
  const {
    fetchProduct,
    updateProduct,
    formData,
    setFormData,
    deleteProduct,
    product,
  } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavoriteStore();
  const { user, isAuthenticated } = useAuthStore();

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const author = product?.User || product?.user;
  const isAuthor = author && user && author.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-8">
        <ArrowLeftIcon />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden bg-base-100">
          <img
            className="size-full object-cover"
            src={product?.img}
            alt={product?.name}
          />
          {product && (
            <>
              {author && (
                <Link
                  to={`/user/${author.id}`}
                  className="flex items-center gap-2 mt-4 text-base-content/80 hover:link"
                >
                  <UserIcon className="size-5" />
                  {author.email}
                </Link>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary gap-2"
                >
                  <ShoppingCartIcon className="size-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() =>
                    isInFavorites(product.id)
                      ? removeFromFavorites(product.id)
                      : addToFavorites(product)
                  }
                  className={`btn gap-2 ${
                    isInFavorites(product.id)
                      ? "btn-error"
                      : "btn-outline btn-error"
                  }`}
                >
                  <HeartIcon
                    className={`size-5 ${isInFavorites(product.id) ? "fill-current" : ""}`}
                  />
                  {isInFavorites(product.id) ? "In Favorites" : "Add to Favorites"}
                </button>
                {isAuthenticated() && author && !isAuthor && (
                  <Link
                    to={`/messages?to=${author.id}`}
                    className="btn btn-outline gap-2"
                  >
                    <MessageCircleIcon className="size-5" />
                    Message seller
                  </Link>
                )}
              </div>
            </>
          )}
        </div>

        {isAuthor ? (
          <div className="card bg-base-100 rounded-lg p-8">
            <h1 className="text-2xl mb-10">Edit Product</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(id);
              }}
              className="flex flex-col gap-5"
            >
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                className="input"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <label htmlFor="img">Image URL</label>
              <input
                id="img"
                type="text"
                className="input"
                value={formData.img}
                placeholder="url"
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="select select-bordered"
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">None</option>
                <option value="game">Game</option>
                <option value="accessory">Accessory</option>
                <option value="collectible">Collectible</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!formData.name || !formData.price}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn bg-red-500 text-white hover:bg-red-400"
                  onClick={() => {
                    navigate("/");
                    deleteProduct(id);
                  }}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card bg-base-100 rounded-lg p-8">
            <h1 className="text-2xl font-bold">{product?.name}</h1>
            <p className="text-3xl font-bold text-primary mt-2">
              ${Number(product?.price).toFixed(2)}
            </p>
            {product?.category && (
              <span className="badge badge-primary mt-2">{product.category}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;

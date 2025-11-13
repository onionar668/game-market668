import React, { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

function ProductPage() {
  const {
    fetchProduct,
    updateProduct,
    formData,
    setFormData,
    deleteProduct,
    product,
  } = useProductStore();

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);
  console.log(product);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
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
        </div>

        <div className=" card bg-base-100 rounded-lg p-8 ">
          <h1 className="text-2xl mb-10">Edit Product</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault(), updateProduct(id);
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
              placeholder="url"
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                type="submit"
                onClick={() => navigate("/")}
                className="btn btn-success"
                disabled={!formData.name || !formData.price}
              >
                Edit change
              </button>
              <button
                className="btn bg-red-500 text-black hover:bg-red-400"
                onClick={(e) => {
                  e.preventDefault(), navigate("/"), deleteProduct(id);
                }}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

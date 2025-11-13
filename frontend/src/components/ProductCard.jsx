import {  EditIcon, TrashIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

function ProductCard({ product }) {
  const {deleteProduct} = useProductStore()

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
        <h2 className="text-primary text-lg ">{product.name}</h2>
        <p className="text-accent text-xl font-bold">${Number(product.price).toFixed(2)}</p>
      </div>

      <div className="card-actions justify-end mb-4 mr-5">
        <Link to={`/product/${product.id}`} className="btn rounded-2xl border-blue-400 text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-black">
            <EditIcon/>
        </Link>
        <button onClick={() => deleteProduct(product.id)} className="btn border-red-500 text-red-500 rounded-2xl cursor-pointer hover:bg-red-500 hover:text-black">
            <TrashIcon/>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

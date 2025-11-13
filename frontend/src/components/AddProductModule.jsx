import { DollarSignIcon, ImageIcon, Package2Icon, PlusCircleIcon } from "lucide-react";
import React from "react";
import { useProductStore } from "../store/useProductStore";

function AddProductModule() {
  const { addProduct, formData, setFormData, loading } = useProductStore();

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
        </form>

        <h3 className="font-bold text-xl mb-8">Add New Product</h3>

        <form onSubmit={addProduct} className="space-y-6">
          <div className="grid gap-6">
            <div className="flex flex-col">
                <span className="label-text text-base font-medium">Product Name</span>
              <label className="input">
                  <Package2Icon  />
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="grow"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  </label>
            </div>
            <div className="flex flex-col">
                <span className="label-text text-base font-medium">Product Name</span>
              <label className="input">
                  <DollarSignIcon  />
                <input
                  type="number"
                  className="grow"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  </label>
            </div>
            <div className="flex flex-col">
                <span className="label-text text-base font-medium">Image URL</span>
              <label className="input">
                  <ImageIcon />
                <input
                  type="text"
                  className="grow"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  />
                  </label>
            </div>
      
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={!formData.name || !formData.price || !formData.img || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AddProductModule;

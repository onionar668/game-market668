import React, { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import { PackageIcon, PlusCircleIcon, RefreshCcwIcon } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AddProductModule from '../components/AddProductModule'

function HomePage() {
      const { products, loading, error, fetchProducts } = useProductStore()
     useEffect(() => {
      fetchProducts()
     }, [fetchProducts])
  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
      <div onClick={()=>document.getElementById('add_product_modal').showModal()} className='flex gap-2 cursor-pointer text-black bg-primary rounded-2xl px-6 py-4'>
        <PlusCircleIcon/>
        Add product
      </div>
      <div className='cursor-pointer'>
        <RefreshCcwIcon onClick={fetchProducts}/>
      </div>
      </div>

      <AddProductModule/>

      {error && <div className='alert alert-error mb-8'>{error}</div>}

      {products.length === 0 && !loading && (
        <div className='flex flex-col gap-4 items-center justify-center mt-[200px]' >
          <div className='bg-base-100 shadow-2xl text-primary p-6 rounded-full'>
          <PackageIcon className='size-10'/> 
          </div>
          <div className='text-center'>
            <h1 className='font-bold text-2xl text-primary'>No products found</h1>
            <p className='w-100 mt-2 text-gray-500'>Get started by added your first product to the inventory</p>
          </div>
        </div>
      )}
      {loading ? (
        <div className='flex justify-center items-center h-50'>
          <div className='loading loading-lg loading-ball'/>
        </div>
      ) : (
        <div className='flex flex-wrap gap-10'>
          {products.map((el) => (
            <ProductCard key={el.id} product={el}/>
          ))}
        </div>
      )}
    </main>
  )
}

export default HomePage

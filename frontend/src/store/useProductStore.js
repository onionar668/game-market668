import { create } from "zustand";
import axios from 'axios'
import {toast} from 'react-hot-toast'

const BASE_URL = 'http://localhost:1515'

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,

    formData:{
        name: '',
        price: '',
        img: ''
    },
    setFormData: (formData) => set({formData}),
    resetForm: () => set({formData: {name:'', price:'', img:''}}),

    addProduct: async(event) => {
        event.preventDefault()
        set({loading:true})
        try{
            const {formData} = get()
            await axios.post(`${BASE_URL}/api/product`, formData)
            await get().fetchProducts()
            get().resetForm()
            toast.success('Product added')
            document.getElementById('add_product_modal').close()
        } catch(e){
            console.log(e)
        } finally{
            set({loading: false})
        }
    },
    fetchProducts: async() => {
        set({loading: true})
        try{
            const response = await axios.get(`${BASE_URL}/api/product`)
            set({products: response.data.data, error: null})
        } catch(err){
            set({err})
        }finally{
            set({loading: false})
        }
    },
    deleteProduct: async(id) => {
        set({loading: true})
        try{
            await axios.delete(`${BASE_URL}/api/product/${id}`)
            set(prev => ({products: prev.products.filter((el) => el.id !== id)}))
            toast.success('product delete successfully')
        }catch(e){
            console.log(e)
            toast.error('something went wrong')
        }finally{
            set({loading: false})
        }
    },
    fetchProduct: async(id) => {
        set({loading: true})
        try{
            const product = await axios.get(`${BASE_URL}/api/product/${id}`)
            set({product: product.data.data,formData: product.data.data ,error: null})
        }catch(e){
            console.log(e)
            toast.error('something went wrong')
        }finally{
            set({loading: false})
        }
    },
    updateProduct: async(id) => {
        set({loading: true})
        try{
            const {formData} = get()
            const update = await axios.put(`${BASE_URL}/api/product/${id}`, formData)
            set({product: update.data.data})
            toast.success('Product is updated')
        } catch(e){
            console.log(e)
            toast.error('something went wrong')
        } finally{
            set({loading: false})
        }
    }
}))
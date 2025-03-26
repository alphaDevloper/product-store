import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  // product state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state, this is like useState hook
  formData: {
    name: "",
    price: "",
    image: "",
  },
  //this fnc will set data in formData variable
  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  // get() is used to get formData and we send formdata as body to the url and then we fetch products with fetchProducts() fnc
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      document.getElementById("add_product_modal").close();
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Failed to Add Product");
    } finally {
      set({ loading: false });
    }
  },

  // below is a fnc
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (error) {
      if (error.status == 429) set({ error: "Limit Exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data,
        error: null,
      });
    } catch (error) {
      toast.error("Error in fetching product");
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData
      );
      set({ currentProduct: response.data.data });
      toast.success("Product Updated Successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));

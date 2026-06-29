import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export interface Category {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: string | Category | null;
}

export interface ProductForm {
  name: string;
  price: string;
  quantity: string;
  image: string;
  description: string;
  categoryId: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    categoryId: "",
  });

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      const pData = await pRes.json();
      const cData = await cRes.json();

      setProducts(pData.products || []);
      setCategories(cData.categories || cData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);

    setForm({
      name: "",
      price: "",
      quantity: "",
      image: "",
      description: "",
      categoryId: "",
    });

    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      image: product.image,
      description: product.description,
      categoryId:
        typeof product.categoryId === "object"
          ? product.categoryId?._id ?? ""
          : product.categoryId ?? "",
    });

    setImagePreview(product.image);
    setShowModal(true);
  };

  const saveProduct = async () => {
    const isNew = !editingId;

    try {
      const res = await fetch(
        isNew
          ? "/api/products"
          : `/api/products/${editingId}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const product = data.product || data;

      if (isNew) {
        setProducts(prev => [product, ...prev]);
      } else {
        setProducts(prev =>
          prev.map(p => (p._id === editingId ? product : p))
        );
      }

      toast.success(isNew ? "Product added" : "Product updated");

      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setProducts(prev =>
        prev.filter(p => p._id !== deleteId)
      );

      toast.success("Product deleted");

      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return {
    loading,

    products,
    categories,

    form,
    setForm,

    showModal,
    setShowModal,

    imagePreview,
    setImagePreview,

    editingId,

    deleteId,
    setDeleteId,

    productRefs,

    fetchProducts,

    openCreateModal,
    openEditModal,

    saveProduct,
    confirmDelete,
  };
}
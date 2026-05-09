"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon, Package, IndianRupee, List, FileText } from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: any;
  setForm: (form: any) => void;
  categories: Category[];
  editingId: string | null;
  imagePreview: string;
  setImagePreview: (val: string) => void;
};

export default function ProductModal({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  categories,
  editingId,
  imagePreview,
  setImagePreview,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: any = {};
    if (!form.name) e.name = "Name is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.quantity === "" || Number(form.quantity) < 0) e.quantity = "Enter stock quantity";
    if (!form.categoryId) e.categoryId = "Select a category";
    if (!form.image) e.image = "Product image is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  const inputClasses = (field: string) =>
    `w-full bg-slate-50 dark:bg-slate-800 border transition-all duration-200 p-3 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 ${
      errors[field] 
        ? "border-red-500 focus:ring-red-500/20" 
        : "border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-slate-500 focus:ring-slate-900/10"
    }`;

  const labelClasses = "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 transform transition-all">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {editingId ? "Edit Product" : "Create New Product"}
            </h3>
            <p className="text-sm text-slate-500">Fill in the details to update your inventory.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[70vh] overflow-y-auto">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="md:col-span-5 space-y-4">
            <label className={labelClasses}><Upload size={14} /> Product Media</label>
            <div className={`relative group aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
              errors.image ? "border-red-500 bg-red-50/50" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
            }`}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="text-slate-400" size={24} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Click to upload or drag & drop</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImagePreview(URL.createObjectURL(file));
                  const reader = new FileReader();
                  reader.onloadend = () => handleChange("image", reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </div>
            
            <div className="relative">
              <label className={labelClasses}><LinkIcon size={14} /> Or Image URL</label>
              <input
                placeholder="https://..."
                value={form.image}
                onChange={(e) => {
                  handleChange("image", e.target.value);
                  setImagePreview(e.target.value);
                }}
                className={inputClasses("image")}
              />
              {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.image}</p>}
            </div>
          </div>

          {/* RIGHT: CORE FIELDS */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <label className={labelClasses}><Package size={14} /> Product Name</label>
              <input
                placeholder="e.g. Midnight Sneakers"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClasses("name")}
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}><IndianRupee size={14} /> Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={inputClasses("price")}
                />
                {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.price}</p>}
              </div>
              <div>
                <label className={labelClasses}><List size={14} /> Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  className={inputClasses("quantity")}
                />
                {errors.quantity && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.quantity}</p>}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className={inputClasses("categoryId")}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.categoryId}</p>}
            </div>

            <div>
              <label className={labelClasses}><FileText size={14} /> Description</label>
              <textarea
                placeholder="Describe this product..."
                rows={4}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`${inputClasses("description")} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 dark:shadow-white/5 active:scale-95 transition-all"
          >
            {editingId ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
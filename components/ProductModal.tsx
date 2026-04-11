"use client";

import React from "react";

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
  if (!show) return null;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px]">
        <h3 className="text-lg font-semibold text-black mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT: IMAGE */}
          <div className="col-span-1">
            <div className="border border-dashed border-black/20 rounded-lg h-40 flex items-center justify-center relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} className=" h-full object-cover" />
              ) : (
                <div className="text-center text-black/50 text-sm">
                  <p>Upload Image</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // preview (blob)
                    const preview = URL.createObjectURL(file);
                    setImagePreview(preview);

                    // convert to base64 (for DB)
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleChange("image", reader.result as string); 
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* URL fallback */}
            <input
              placeholder="Or paste image URL"
              value={form.image}
              onChange={(e) => {
                handleChange("image", e.target.value);
                setImagePreview(e.target.value);
              }}
              className="w-full border p-2 rounded text-black mt-2"
            />
          </div>

          {/* RIGHT: FORM */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border p-2 rounded text-black col-span-2"
            />

            <input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="border p-2 rounded text-black"
            />

            <input
              type="number"
              placeholder="Stock"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="border p-2 rounded text-black"
            />

            <select
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="border p-2 rounded text-black col-span-2"
            >
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border p-2 rounded text-black col-span-2"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

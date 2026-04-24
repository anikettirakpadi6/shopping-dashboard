"use client";

import React, { useState } from "react";

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

  if (!show) return null;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: any = {};

    if (!form.name) e.name = "Name is required!";
    if (!form.price || Number(form.price) <= 0) e.price = "Price should be 0 or more!";
    if (form.quantity === "" || Number(form.quantity) < 0)
      e.quantity = "Quantity should be 0 or more!";
    if (!form.categoryId) e.categoryId = "Category is required!";
    if (!form.image) e.image = "Image is required!";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  const input = (field: string) =>
    `w-full border p-2 rounded text-black ${
      errors[field] ? "border-red-500" : "border-black/20"
    }`;

  const errorText = (field: string) => (
    <p className="text-red-500 text-sm h-4">{errors[field] || ""}</p>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px]">
        <h3 className="text-lg font-semibold text-black mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {/* IMAGE */}
          <div>
            <div
              className={`border border-dashed rounded-lg h-40 flex items-center justify-center relative overflow-hidden ${
                errors.image ? "border-red-500" : "border-black/20"
              }`}
            >
              {imagePreview ? (
                <img src={imagePreview} className="h-full object-cover" />
              ) : (
                <p className="text-black/50 text-sm">Upload Image</p>
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
                  reader.onloadend = () =>
                    handleChange("image", reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            {errorText("image")}

            <input
              placeholder="Or paste image URL"
              value={form.image}
              onChange={(e) => {
                handleChange("image", e.target.value);
                setImagePreview(e.target.value);
              }}
              className={`${input("image")} mt-2`}
            />
          </div>

          {/* FORM */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {/* NAME */}
            <div className="col-span-2">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={input("name")}
              />
              {errorText("name")}
            </div>

            {/* PRICE */}
            <div>
              <input
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={input("price")}
              />
              {errorText("price")}
            </div>

            {/* STOCK */}
            <div>
              <input
                type="number"
                placeholder="Stock"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className={input("quantity")}
              />
              {errorText("quantity")}
            </div>

            {/* CATEGORY */}
            <div className="col-span-2">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  handleChange("categoryId", e.target.value)
                }
                className={input("categoryId")}
              ><option value="">Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errorText("categoryId")}
            </div>

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              className="w-full border p-2 rounded text-black col-span-2 border-black/20"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-100">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
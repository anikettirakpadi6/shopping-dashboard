import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
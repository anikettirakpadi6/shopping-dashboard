import "dotenv/config";
import mongoose from "mongoose";
import Category from "../models/Category"; 
import { connectToDatabase } from "../lib/mongoose";        

const categories = [
  { name: "Electronics" },
  { name: "Furniture" },
  { name: "Stationery" },
  { name: "Clothing" },
  { name: "Kitchenware" },
];

async function seed() {
  try {
    await connectToDatabase(); 
    console.log("DB connected");

    for (const cat of categories) {
      await Category.updateOne(
        { name: cat.name },
        { $set: cat },
        { upsert: true }
      );
    }

    console.log("Categories seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
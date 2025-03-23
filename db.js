require('dotenv').config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB is connected to the app via mongoose");

    // Define a flexible schema
    const flexibleSchema = new mongoose.Schema({}, { strict: false });

    // Load food items
    const FoodItem = mongoose.model("FoodItem", flexibleSchema, "food_items");
    const data = await FoodItem.find({});
    if (!data || data.length === 0) {
      console.log("❌ No documents found in the 'food_items' collection.");
    } else {
      global.food_items = data;
      console.log("✅ Food items loaded:", global.food_items.length);
    }

    // Load food categories
    const FoodCategory = mongoose.model("FoodCategory", flexibleSchema, "foodCategory");
    const categoryData = await FoodCategory.find({});
    if (!categoryData || categoryData.length === 0) {
      console.log("❌ No documents found in the 'foodCategory' collection.");
    } else {
      global.food_Category = categoryData;
      console.log("✅ Food categories loaded:", global.food_Category.length);
    }

  } catch (error) {
    console.error("❌ Error connecting to MongoDB or retrieving data:", error);
  }
};

module.exports = connectDB;

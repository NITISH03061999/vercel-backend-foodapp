require('dotenv').config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("MongoDB is connected to the app via mongoose");

    // Define a flexible schema
    const flexibleSchema = new mongoose.Schema({}, { strict: false });

    // Create a model using the flexible schema and specify the collection name
    const FoodItem = mongoose.model("FoodItem", flexibleSchema, "food_items");

    // Retrieve all documents from the collection -----------------------------------------------------
    const data = await FoodItem.find({});
    if (data.length === 0) {
      console.log("No documents found in the 'food_items' collection.");
    } else {
      global.food_items=data;
      // console.log(global.food_items);
      
      console.log("Loading Data ......");
    //   console.log(data);
    }


    //getting the foodCategory--------------------------------------------------------------------------
    const foodCategory = mongoose.model("foodCategory", flexibleSchema, "foodCategory");
    const categoryData= await foodCategory.find({});
    // console.log(categoryData);

    if (categoryData.length === 0) {
      console.log("No documents found in the 'food_items' collection.");
    } else {
      global.food_Category=categoryData;
      // console.log(global.food_Category);
      
      console.log("Loading Data ......");
    //   console.log(data);
    }
    

    
  
  } catch (error) {
    console.error("Error connecting to MongoDB or retrieving data:", error);
  }
};

module.exports = connectDB;

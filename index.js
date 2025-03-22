const express = require("express");
const app = express();
const mongoDB = require('./db')
const cors = require("cors");

const port = process.env.PORT || 5000;

mongoDB();
app.use(cors({
  origin: "https://food-deliverry-app-frontend.vercel.app/", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("HelloWorld");
});
app.use(express.json())
app.use ('/api', require('./Routes/CreateUser'))
app.use ('/api', require('./Routes/DisplayData'))
app.use ('/api', require('./Routes/OrderData'))



app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});


//S38KRvr14LvWk4EK
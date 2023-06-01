const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./db");

const app = express();
app.use(express.json());
// ...
connectDB();
// Use the user routes
app.use("/users", userRoutes);

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 3000");
});

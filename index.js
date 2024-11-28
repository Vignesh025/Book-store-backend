const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet"); // Recommended for security headers
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-store-frontend-green.vercel.app",
      "https://book-store-backend-ten-chi.vercel.app",
    ],
    credentials: true,
  })
);

// Add Helmet for Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "https://vercel.live", // Allow scripts from Vercel live
        ],
        "style-src": ["'self'", "'unsafe-inline'","https://vercel.com"], // Allow inline styles if needed
        "img-src": ["'self'", "data:","https://vercel.com","https://*.pusher.com"], // Allow images from same origin and data URIs
        "connect-src": [
          "'self'",
          "https://book-store-frontend-green.vercel.app",
          "https://vercel.live",
          "https://*.pusher.com",
          "https://*.pusherapp.com"
        ],
        "frame-src": ["https://vercel.live"],
        "font-src": ["https://vercel.live"],
      },
    },
  })
);

// Routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("Book Store Server is running!");
  });
}

main()
  .then(() => console.log("Mongodb connected successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

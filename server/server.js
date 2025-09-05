import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import {stripeWebhooks} from "./controllers/stripeWebhooks.js";

const app = express();

connectDB().catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

connectCloudinary().catch(err => {
  console.error("Cloudinary connection error:", err);
  process.exit(1);
});

app.use(cors());
app.use(clerkMiddleware());

// API to listen to Stripe Webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }), 
  clerkWebhooks
);

app.use(express.json());

app.get("/", (req, res) => {  
  res.send("API is working");
});

// Optional: Add any other routes here
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Server Error");
});

export default app;

// ✅ Only run the server locally (i.e., not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

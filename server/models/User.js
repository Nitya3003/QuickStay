import mongoose from "mongoose";
// Define the user schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk user ID
  username: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  role: {
    type: String,
    enum: ["User", "hotelOwner"],
    default: "User"
  },
  recentSearchedCities:  [{ type: String, required: true }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

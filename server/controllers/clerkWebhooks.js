import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // ✅ Use raw req.body (already parsed by express.raw())
    const event = whook.verify(req.body, headers);

    const { type, data } = event;

    switch (type) {
      case "user.created":{    
        const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        username: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
        recentSearchedCities: [],
      };
      await User.create(userData);
      break;
      }

      case "user.updated":{
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
            recentSearchedCities: [],
          };
      await User.findByIdAndUpdate(data.id, userData);
      break;
      }

      case "user.deleted":
        await User.findByIdAndDelete(data.id); 
        break;

      default:
        console.log("Unhandled event type:", type);
        break;
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;

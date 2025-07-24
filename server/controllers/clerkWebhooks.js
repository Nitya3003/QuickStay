import User from "../../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers)

    // Getting data from request body
    const { type, data } = req.body;

    const userData = {
    _id: data.id,
    email: data.email_addresses[0].email_address,
    username: data.first_name + " " + data.last_name,
    image: data.image_url,
}

// Switch Cases for different Events
switch (type) {
  case "user.created": {
    await User.create(userData);
    break;
  }

  case "user.updated": {
    await User.findByIdAndUpdate(data.id, userData);
    break;
  }
    case "user.deleted": {
    await User.findByIdAndUpdate(data.id);
    break;
  }
  default: {
    console.log("Unhandled event type:", type);
    break;}
}
    res.json({success: true, message: "Webhook processed successfully"});    
  } catch (error) {
    // error handling logic here (not visible in image)
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;

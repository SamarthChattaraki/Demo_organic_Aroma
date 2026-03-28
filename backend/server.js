const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 Razorpay Keys (LIVE or TEST)
const razorpay = new Razorpay({
  key_id: "rzp_live_SVlJcgQqonaJ9c",
  key_secret: "RdhgZ6FzZQJog0VM3QtXZAzs",
});
// 📧 Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "samarthchattaraki@gmail.com", // 👈 your email
    pass: "shjwnrdcianltgdb", // 👈 Gmail App Password
  },
});

// 🔹 Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).send("Error creating order");
  }
});

// 🔹 Verify + Save Order + Send Email
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      paymentId,
      orderId,
      customerName,
      phone,
      email, // ✅ NEW
      product,
      quantity,
    } = req.body;

    console.log("✅ New Order Received:");
    console.log(req.body);

    // 📧 Email to Customer
    const customerMail = {
      from: "samarthchattaraki@gmail.com",
      to: email,
      subject: "Order Confirmation - Organic Aroma",
      text: `
Hello ${customerName},

✅ Your order has been placed successfully!

Product: ${product}
Quantity: ${quantity}
Payment ID: ${paymentId}

Thank you for shopping with us 🌿
      `,
    };

    // 📧 Email to Owner
    const ownerMail = {
      from: "samarthchattaraki@gmail.com",
      to: "chattarakisamarth12@gmail.com", // 👈 owner email
      subject: "🛍️ New Order Received",
      text: `
New Order Received!

Customer: ${customerName}
Phone: ${phone}
Email: ${email}
Product: ${product}
Quantity: ${quantity}
Payment ID: ${paymentId}
      `,
    };

    // 🔹 Send Emails
    await transporter.sendMail(customerMail);
    await transporter.sendMail(ownerMail);

    res.json({ success: true });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).send("Error processing order");
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

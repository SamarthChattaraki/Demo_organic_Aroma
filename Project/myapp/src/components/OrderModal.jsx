import React, { useState } from "react";
import "./OrganicPage.css";

function OrderModal({ isOpen, onClose, product, quantity }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOrder = async () => {
    if (!customerName || !phone || !email) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 🔹 1. Create order
      const res = await fetch(
        "https://demo-organic-aroma.onrender.com/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: product.price * quantity,
          }),
        },
      );

      const data = await res.json();
      console.log("ORDER DATA:", data);

      // 🔹 2. Razorpay
      const options = {
        key: "rzp_live_SVlJcgQqonaJ9c",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: async function (response) {
          try {
            await fetch(
              "https://demo-organic-aroma.onrender.com/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  customerName,
                  phone,
                  email, // ✅ SEND EMAIL
                  product: product.name,
                  quantity,
                }),
              },
            );

            window.location.href = "/success";
          } catch (err) {
            console.error(err);
            alert("Error saving order");
          }
        },

        prefill: {
          name: customerName,
          contact: phone,
          email: email, // ✅ PREFILL
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("❌ Payment Failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert("⚠️ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Complete Your Order</h2>

        <label>Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Phone</label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />

        {/* ✅ EMAIL FIELD */}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <label>Quantity</label>
        <input type="text" value={quantity} disabled />

        <div className="modal-actions">
          <button onClick={handleOrder} disabled={loading}>
            {loading ? "Processing..." : "Pay & Order"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;

import { useEffect, useState } from "react";
import axios from "axios";

export default function Subscription() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const startSubscription = async () => {
    const token = localStorage.getItem("token");

    try {
      // 1) Create subscription from backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/payments/create-subscription`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { subscriptionId, key_id } = res.data;

      // 2) Razorpay Checkout options
      const options = {
        key: key_id,
        subscription_id: subscriptionId,
        name: "Coaching Software",
        description: "Monthly Subscription ₹499",
        handler: function (response) {
          alert("Payment Successful!");

          // Optional: reload profile
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded");
      }
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Error starting subscription");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Subscribe</h1>
      <p>Price: ₹499 / month</p>

      <button onClick={startSubscription} disabled={!scriptLoaded}>
        {scriptLoaded ? "Start Subscription" : "Loading..."}
      </button>
    </div>
  );
}
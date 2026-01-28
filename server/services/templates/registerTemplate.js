const registerTemplate = (customerName, restaurantName) => {
  // Live URL (Isse env variable se bhi le sakte hain agar chaho)
  const appUrl = "https://restaurant-qr-scanner.vercel.app";

  return `Hi ${customerName},

Welcome to ${restaurantName}! 🎉

As a thank-you for signing up, here’s a special offer just for you:

🎁 Use Code: WELCOME30  
💰 Get 30% OFF on your first order

👉 Order Now: ${appUrl}

Offer valid for a limited time.
Happy eating! 🍕  

${restaurantName} Team`;
};

export default registerTemplate;
export const ENHANCED_PRODUCT_IMAGES = {
  // Health & Nutrition
  h001: "https://www.greendna.in/cdn/shop/products/almond_1024x1024@2x.jpg?v=1564303629",
  h002: "https://m.media-amazon.com/images/I/71OsEAdPuZL._SL1500_.jpg",
  h003: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
  h004: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&auto=format",

  // Beverages
  b001: "https://himalayawellness.in/cdn/shop/products/green-tea-ginger-10s_1800x1800.jpg?v=1622097819",
  b002: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop&auto=format",
  b003: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop&auto=format",
  b004: "https://m.media-amazon.com/images/I/41eXq0EW5BL._SX300_SY300_QL70_FMwebp_.jpg",

  // Snacks
  s001: "https://m.media-amazon.com/images/I/41ZWkNxUw3L._SX300_SY300_QL70_FMwebp_.jpg",
  s002: "https://images.unsplash.com/photo-1559656914-a30970c1affd?w=300&h=300&fit=crop&auto=format",
  s003: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&auto=format",
  s004: "https://apisap.fabindia.com/medias/801541508396-1.jpg?context=bWFzdGVyfGltYWdlc3wxNDUwODV8aW1hZ2UvanBlZ3xhR0ZtTDJobVppOHhNREUyTnprMk9UTXpOalV5Tnpndk9EQXhOVFF4TlRBNE16azJYekV1YW5CbnxiNTMxZDNiYzZiODMyZGQyNmU4MzFkNjIwY2E1NzU3NmU2NGNlYmVmNDI1ZmUwZDYyNzdiZTAyNjdhNjEyNzA2&aio=w-400",

  // Personal Care
  p001: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop&auto=format",
  p002: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&auto=format",
  p003: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop&auto=format",

  // Home & Lifestyle
  l001: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&auto=format",
  l002: "https://www.saltean.com/wp-content/uploads/2021/07/himalayan-rock-salt-candle-holder.png",
  l003: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop&auto=format",

  // Fitness
  f001: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop&auto=format",
  f002: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&auto=format",

  // Baby & Kids
  k001: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&auto=format",

  // Pantry
  pt001: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&auto=format",
  pt002: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format",
}

// Update the PRODUCTS_DATASET with enhanced images
import { PRODUCTS_DATASET } from "./products"

export const ENHANCED_PRODUCTS_DATASET = PRODUCTS_DATASET.map((product) => ({
  ...product,
  image: ENHANCED_PRODUCT_IMAGES[product.id as keyof typeof ENHANCED_PRODUCT_IMAGES] || product.image,
}))

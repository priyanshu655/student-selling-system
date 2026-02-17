import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"], 
      trim: true 
    },
    price: { 
      type: Number, 
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: { 
      type: String, 
      required: [true, "Category is required"] 
    },
    description: { 
      type: String, 
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    image: { 
      type: String, 
      required: [true, "Image URL is required"] 
    },
    
    // ✅ The link to the User model
    sellerId: { 
      type: Schema.Types.ObjectId, // Standardized Schema type
      ref: "User",                  // References the User model exactly
      required: true 
    },

    // ✅ Index for the Campus Filter
    sellerDomain: { 
      type: String, 
      required: true,
      index: true, 
      lowercase: true, // Forces "PPSU.AC.IN" to "ppsu.ac.in" automatically
      trim: true
    },
  },
  { 
    timestamps: true 
  }
);

// Prevent re-compilation of model in Next.js development (Turbopack fix)
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
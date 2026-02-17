import mongoose, { Schema, Document } from "mongoose";

/* ✅ TypeScript Interface */
export interface IUser extends Document {
  name: string;
  email: string;
  collegeId: string;

  // Future fields
  password?: string;
  isSeller: boolean;
  role: "student" | "admin";
}

/* ✅ User Schema */
const UserSchema: Schema<IUser> = new Schema(
  {
    // Full Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // College Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // College ID Number
    collegeId: {
      type: String,
      required: true,
      unique: true,
    },

    // Seller Status (default false)
    isSeller: {
      type: Boolean,
      default: false,
    },

    // Role (Student by default)
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Password (optional for now, required when auth added)
    password: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

/* ✅ Export Model */
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

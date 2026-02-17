"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

/* ✅ Convert Google Drive Share Link → Direct Image Link */
function convertDriveLink(url: string) {
  // Example:
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing

  const match = url.match(/file\/d\/([^/]+)/);

  if (!match) return url;

  const fileId = match[1];

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export default function ItemCard({ item }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // ✅ MongoDB Fields
  const name = item?.name || "Untitled Item";
  const price = item?.price || 0;
  const category = item?.category || "General";
  const id = item?._id;

  // ✅ Correct Image Handling
  const imageUrl =
    item?.image && item.image.length > 5
      ? convertDriveLink(item.image)
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full min-h-[520px] bg-white rounded-[32px] p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ Category */}
      <div className="mb-5">
        <span className="px-3 py-1.5 rounded-full border border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-orange-500 transition">
          {category}
        </span>
      </div>

      {/* ✅ Product Image */}
      <div className="w-full h-52 mb-6 rounded-2xl overflow-hidden bg-zinc-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop";
          }}
        />
      </div>

      {/* ✅ Product Title */}
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-zinc-900">
        {name}
      </h2>

      {/* ✅ Price */}
      <p className="text-xl font-bold text-zinc-500 mt-4">₹{price}</p>

      {/* ✅ View Details Button */}
      <div className="mt-8 pt-6 border-t border-zinc-100">
        <Link href={`/item/${id}`} className="block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-widest group-hover:text-orange-500 transition">
              View Details
            </span>

            <div className="w-10 h-10 rounded-full border flex items-center justify-center group-hover:bg-black group-hover:w-28 transition-all duration-500 overflow-hidden">
              <ArrowUpRight
                className={`w-5 h-5 transition-all duration-300 ${
                  isHovered ? "text-white rotate-45" : "text-black"
                }`}
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Hover Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-orange-500 w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

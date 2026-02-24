import React from 'react'

export default function CreateProductForm() {
  return (
    <div
        className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"
        >
             <form
      className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-5"
      noValidate
    >
      {/* Product Name */}
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Name <span className="text-red-500">*</span>
        </label>

        <input
          id="productName"
          name="productName"
          type="text"
          required
          placeholder="Enter product name"
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500 transition"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-red-500">*</span>
        </label>

        <textarea
          id="description"
          name="description"
          rows="4"
          required
          placeholder="Enter product description"
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500 transition resize-none"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Image <span className="text-red-500">*</span>
        </label>

        <input
          id="image"
          name="image"
          type="file"
          required
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Price (₹) <span className="text-red-500">*</span>
        </label>

        <input
          id="price"
          name="price"
          type="number"
          required
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="Enter product price"
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500 transition"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg
        font-semibold hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        focus:ring-offset-2 transition"
      >
        Create Product
      </button>
    </form>
 </div>
  );
}

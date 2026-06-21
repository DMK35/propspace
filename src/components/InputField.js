// components/InputField.js
// A reusable input box used across Login, Register, Profile, and Create Listing forms.
// Instead of copy-pasting <input> markup everywhere, we build it once here.

import React from "react";

function InputField({ label, type = "text", value, onChange, placeholder, required = false, error }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {/* Show validation error text under the field, only if there is one */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default InputField;

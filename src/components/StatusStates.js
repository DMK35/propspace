// components/StatusStates.js
// The assignment specifically asks for clear visual feedback on
// Loading / Empty / Error states. Instead of repeating this markup
// everywhere, we define them once here and reuse them.

import React from "react";

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      {/* Simple CSS spinner using Tailwind's animate-spin utility */}
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <p className="text-4xl mb-2">📭</p>
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-red-500">
      <p className="text-4xl mb-2">⚠️</p>
      <p>{message}</p>
    </div>
  );
}

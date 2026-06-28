"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          fontSize: "0.875rem",
          boxShadow: "var(--shadow-soft)",
        },
        success: {
          iconTheme: {
            primary: "#6f4e37",
            secondary: "#faf8f5",
          },
        },
        error: {
          iconTheme: {
            primary: "#b91c1c",
            secondary: "#faf8f5",
          },
        },
      }}
    />
  );
}

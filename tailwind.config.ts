import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007bff",
        accent: "#f4b400",
        base: {
          100: "#ffffff",
          200: "#f2f2f2",
        },
        baseContent: "#343a40",
        muted: "#6c757d",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(-6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      ringColor: {
        primary: "#007BFF",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cleanwhite: {
          primary: "#007BFF",
          secondary: "#6C757D",
          accent: "#007BFF", // optional same as primary for minimal palette
          success: "#198754",
          warning: "#FFC107",
          error: "#DC3545",
          info: "#0DCAF0",
          "base-100": "#FFFFFF",
          "base-200": "#F1F3F5",
          "base-content": "#212529",
          muted: "#6C757D",
        },
      },
    ],
    darkTheme: "dark",
  },
};

import daisyui from "daisyui";
export default {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(-5px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "luxury"], // Add more themes as needed
  },
};

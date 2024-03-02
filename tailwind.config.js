module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        alert: {
          100: "#FCF3F2",
          200: "#FADCD9",
          300: "#FABBB4",
          400: "#FC9086",
          500: "#FA5343",
          600: "#D91F11",
          700: "#A1160A",
          800: "#75160C",
          900: "#4F150F",
          1000: "#24120C",
        },
        primary: {
          25: "#F1F4FE",
          50: "#E6ECFE",
          100: "#D4DBFC",
          200: "#A9B8FA",
          300: "#7C90F1",
          400: "#5A6FE4",
          500: "#2940D3",
          600: "#1D30B5",
          700: "#142297",
          800: "#0D177A",
          900: "#070F65",
        },
        blue: {
          400: "#2589FE",
          500: "#0070F3",
          600: "#2F6FEB",
        },
      },
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px", // Example: Custom screen size for extra small devices
        xxl: "1300px", // Example: Custom screen size for very large devices
        custom: "1440px", // Example: Custom screen size named 'custom'
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideTop: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
        slideInLeft: "slideInLeft 0.5s ease-out forwards",
        slideRight: "slideRight 0.5s ease-in-out",
        slideBottom: "slideBottom 0.5s ease-in-out",
        slideTop: "slideTop 0.5s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-custom":
          "linear-gradient(180deg, rgba(1, 114, 178, 0.91) 0%, rgba(0, 49, 76, 0.91) 89%)",
        "small-background": "#edf5fa",
        "gradient-resolved":
          "linear-gradient(90deg, rgba(46, 125, 50, 1) 0%, rgba(102, 187, 106, 1) 100%)",
        "gradient-inspection":
          "linear-gradient(90deg, rgba(21, 101, 192, 1) 0%, rgba(66, 165, 245, 1) 100%)",
        "gradient-reported":
          "linear-gradient(90deg, rgba(198, 40, 40, 1) 0%, rgba(239, 83, 80, 1) 100%)",
        "gradient-workingOn":
          "linear-gradient(90deg, rgba(255, 193, 7, 1) 0%, rgba(255, 238, 88, 1) 100%)",
      },
      colors: {
        buttonColorPrimary: "#0172B2B2",
        generalBackground: "#edf5fa",
        lightBlue: "rgba(217, 217, 217, 0.52)", // Add your custom color
      },
    },
  },
  plugins: [],
};

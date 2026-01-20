/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/home/home.component.html",
    "./src/app/login/login.component.html",
    "./src/app/signup/signup.component.html",
    "./src/app/home/users.component.html",
    "./src/app/settings/settings.component.html",
    "./src/index.html",
    "./src/app/home/chat/chat.component.html",
    "./src/app/app.component.html",
    "./src/app/home/user-item/user-item.component.html",
  ],
  theme: {
    extend: {
      colors: {
        "chateau-green": {
          50: "#f0fdf5",
          100: "#dcfce8",
          200: "#bbf7d1",
          300: "#86efad",
          400: "#4ade81",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803c",
          800: "#166533",
          900: "#14532b",
          950: "#052e14",
        },
        "light-white": "#F5F5F5",
        "light-gray": "#EEEEEE",
      },
      screens: {
        mb: { max: "600px" },
      },
    },
  },
  plugins: [],
};

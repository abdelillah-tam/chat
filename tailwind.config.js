/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/home/home.component.html",
    "./src/app/login/login.component.html",
    "./src/app/signup/signup.component.html",
    "./src/app/home/chat/chat.component.html",
    "./src/app/home/chat/contact-information/contact-information.component.html",
    "./src/app/home/users/users.component.html",
    "./*src/app/home/settings/settings.component.html",
    "./src/index.html",
  ],
  theme: {
    extend: {
      screens: {
        'mb': {'max':'600px'}
      }
    },
  },
  plugins: [],
};

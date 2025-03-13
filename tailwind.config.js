/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Changa One', 'sans-serif'],
        mono: ['Goblin One', 'sans-serif'],
        serif: ['Akaya Kanadaka', 'sans-serif'],
      },
      // colors: {
      //   primary: '#ade8f4',
      //   sec: '#90e0ef',
      //   third: '#48cae4',
      //   fourth: '#00b4d8',
      //   fifth: '#0096c7',
      //   sixth: '#0077b6',
      //   seventh: '#023e8a',
      // },
    },
  },
  plugins: [],
};

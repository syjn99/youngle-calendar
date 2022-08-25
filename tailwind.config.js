/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      leading: {
        '12': '48px',
      },
      spacing: {
        '0/7': '0',
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '7/7': '100%',
        'first': "0rem",
        'second': "21px",
        'third': '42px',
        'minus': '-4px',
        '1/10': '10%',
        '8/10': '80%',
        '9/10': '90%',
        '1/20': '5%',
        'week-1/7': '12.8571%',
        'week-2/7': '25.7142%',
        'week-3/7': '38.5714%',
        'week-4/7': '51.4285%',
        'week-5/7': '64.2857%',
        'week-6/7': '77.1428%',
        'week-7/7': '90%',
      },
      left: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '7/7': '100%',
      }
    }
  },
  plugins: [],
}

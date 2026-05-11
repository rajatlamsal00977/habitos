/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B5CEB',
          light: '#7D7EFF',
          soft: '#C9CBFF',
          end: '#6E72FF',
        },
        surface: {
          card: '#FFFFFF',
          secondary: '#EEF2FF',
        },
        background: {
          cream: '#F5EBDD',
          off: '#F8F8F8',
          gray: '#EFEFEF',
          beige: '#F4E7DA',
        },
        accent: {
          success: '#73C45E',
          softGreen: '#A5D86E',
          warning: '#F4A261',
          peach: '#FFD7C2',
          softRed: '#E76F51',
          gold: '#FFC857',
        },
        content: {
          primary: '#2C2C36',
          secondary: '#6F6F7B',
          muted: '#A0A0AE',
          inverse: '#FFFFFF',
        },
        dark: {
          bg: '#12131A',
          surface: '#1B1C24',
          primary: '#7D7EFF',
          text: '#F5F5F7',
        },
      },
      borderRadius: {
        habit: '28px',
        button: '18px',
      },
    },
  },
  plugins: [],
};

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        accent: '#F97316',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#293548',
          850: '#172033',
        },
        node: {
          candidate: '#3b82f6', // blue-500
          skill: '#10b981',     // emerald-500
          company: '#f59e0b',   // amber-500
          role: '#a855f7',      // purple-500
          project: '#f43f5e'    // rose-500
        }
      }
    },
  },
  plugins: [],
}

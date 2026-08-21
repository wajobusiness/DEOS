/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deos: {
          primary: '#4F46E5', // Indigo 600
          'primary-hover': '#4338CA', // Indigo 700
          'primary-light': '#EEF2FF', // Indigo 50
          dark: '#0B0F19', // Navy Black Sidebar
          'dark-card': '#111827', // Slate 900
          'dark-border': '#1F2937', // Slate 800
          canvas: '#F8FAFC', // Slate 50 Background
          surface: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          text: '#0F172A',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

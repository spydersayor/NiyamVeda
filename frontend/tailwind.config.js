/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060C1A',
          900: '#0B132B',
          800: '#0F172A',
          700: '#1E293B',
          600: '#2A3F5F',
          500: '#334155',
        },
        saffron: {
          DEFAULT: '#FF7828',
          light: '#FF9933',
          dark: '#E05E10',
        },
        emerald: {
          verified: '#10B981',
        },
        amber: {
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.3)',
        'orange': '0 0 20px rgba(255,120,40,0.3)',
        'glow': '0 0 40px rgba(255,120,40,0.15)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0B132B 0%, #0F172A 100%)',
        'gradient-card': 'linear-gradient(145deg, #1a2640 0%, #0F172A 100%)',
        'gradient-saffron': 'linear-gradient(135deg, #FF7828 0%, #FF9933 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 70% 50%, rgba(255,120,40,0.08) 0%, transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

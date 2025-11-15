import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F7F6",
          100: "#CCEFED",
          200: "#99DFDB",
          300: "#66CFC9",
          400: "#4DC4BF",
          500: "#00A9A3", // Main primary color
          600: "#008B86", // Primary dark
          700: "#006D69",
          800: "#004F4C",
          900: "#00312F",
        },
        secondary: {
          50: "#E5F2F1",
          100: "#CCE5E3",
          200: "#99CBC7",
          300: "#66B1AB",
          400: "#33978F",
          500: "#0B7A75", // Secondary color
          600: "#09625D",
          700: "#074946",
          800: "#05312E",
          900: "#021917",
        },
        accent: {
          50: "#FFECF3",
          100: "#FFD9E7",
          200: "#FFB3CF",
          300: "#FF8DB7",
          400: "#FF8FAB",
          500: "#FF6B9D", // Accent pink
          600: "#FF3D7F",
          700: "#FF0F61",
          800: "#E0004E",
          900: "#B0003D",
        },
        surface: {
          DEFAULT: "#F5F5F5",
          dark: "#1A1A1A",
        },
        text: {
          primary: "#212121",
          secondary: "#757575",
          on_primary: "#FFFFFF",
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'bobbing': 'bobbing 3s ease-in-out infinite',
        'blink': 'blink 4s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(0.98)' },
          '50%': { transform: 'scale(1)' },
        },
        bobbing: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(25px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};

export default config;

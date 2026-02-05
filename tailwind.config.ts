import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif'
        ],
        serif: [
          'Lora',
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif'
        ],
        mono: [
          'Space Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        status: {
          active: 'hsl(var(--status-active))',
          operating: 'hsl(var(--status-operating))',
          frozen: 'hsl(var(--status-frozen))'
        },
        // Sacred Gold Spectrum
        gold: {
          DEFAULT: 'hsl(42 95% 55%)',
          light: 'hsl(var(--gold-light))',
          bright: 'hsl(var(--gold-bright))',
          deep: 'hsl(var(--gold-deep))',
          ember: 'hsl(var(--gold-ember))'
        },
        // Sovereign Silver
        silver: {
          DEFAULT: 'hsl(0 0% 70%)',
          light: 'hsl(var(--silver-light))',
          mid: 'hsl(var(--silver-mid))',
          dark: 'hsl(var(--silver-dark))'
        },
        // Dimensional Purple
        purple: {
          DEFAULT: 'hsl(275 50% 50%)',
          light: 'hsl(var(--purple-light))',
          mid: 'hsl(var(--purple-mid))',
          deep: 'hsl(var(--purple-deep))',
          void: 'hsl(var(--purple-void))'
        },
        // Crimson Power
        crimson: {
          DEFAULT: 'hsl(0 80% 55%)',
          bright: 'hsl(var(--crimson-bright))',
          deep: 'hsl(var(--crimson-deep))',
          blood: 'hsl(var(--crimson-blood))'
        },
        // Neutral Grey Scale
        grey: {
          100: 'hsl(var(--grey-100))',
          200: 'hsl(var(--grey-200))',
          300: 'hsl(var(--grey-300))',
          400: 'hsl(var(--grey-400))',
          500: 'hsl(var(--grey-500))',
          600: 'hsl(var(--grey-600))',
          700: 'hsl(var(--grey-700))',
          800: 'hsl(var(--grey-800))',
          900: 'hsl(var(--grey-900))'
        },
        // Legacy dimensional
        dimensional: {
          dark: 'hsl(0 0% 2%)',
          deep: 'hsl(0 0% 4%)',
          mid: 'hsl(0 0% 8%)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        },
        'sovereign-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1) drop-shadow(0 0 60px hsl(42 100% 55% / 0.4))'
          },
          '50%': { 
            transform: 'scale(1.03)',
            filter: 'brightness(1.15) drop-shadow(0 0 120px hsl(42 100% 55% / 0.6))'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'sovereign-pulse': 'sovereign-pulse 6s ease-in-out infinite'
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-sovereign': 'linear-gradient(135deg, hsl(42 95% 55%), hsl(35 90% 50%), hsl(28 95% 50%))',
        'gradient-silver': 'linear-gradient(135deg, hsl(0 0% 90%), hsl(0 0% 70%), hsl(0 0% 50%))',
        'gradient-crimson': 'linear-gradient(135deg, hsl(0 80% 60%), hsl(355 75% 50%), hsl(350 70% 40%))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
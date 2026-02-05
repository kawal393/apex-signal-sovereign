import type { Config } from "tailwindcss";
import plugin from 'tailwindcss-animate';

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
			gold: {
				DEFAULT: 'hsl(42 90% 55%)',
				light: 'hsl(48 100% 75%)',
				bright: 'hsl(45 100% 68%)',
				deep: 'hsl(35 85% 45%)',
				ember: 'hsl(28 90% 50%)'
			},
			dimensional: {
				dark: 'hsl(260 20% 2%)',
				deep: 'hsl(260 15% 5%)',
				mid: 'hsl(260 12% 10%)'
			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(30px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0) rotate(0deg)'
  				},
  				'50%': {
  					transform: 'translateY(-20px) rotate(2deg)'
  				}
  			},
  			'float-slow': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'pulse-glow': {
  				'0%, 100%': {
  					opacity: '0.4'
  				},
  				'50%': {
  					opacity: '0.8'
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
  			'pulse-glow': 'pulse-glow 4s ease-in-out infinite'
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
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

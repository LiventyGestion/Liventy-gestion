import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
			'montserrat': ['Montserrat', 'sans-serif'],
			'lato': ['Lato', 'sans-serif'],
			'sans': ['Lato', 'sans-serif'],
		},
			spacing: {
				'base': '8px',
				'section-mobile': '40px',
				'section-tablet': '56px', 
				'section-desktop': '64px',
				'section-desktop-lg': '96px',
			},
			colors: {
				// Brand colors
				'brand-charcoal': 'hsl(var(--brand-charcoal))',
				'brand-orange': 'hsl(var(--brand-orange))',
				'brand-white': 'hsl(var(--brand-white))',
				
				// Neutral grays
				'neutral-50': 'hsl(var(--neutral-50))',
				'neutral-100': 'hsl(var(--neutral-100))',
				'neutral-200': 'hsl(var(--neutral-200))',
				'neutral-300': 'hsl(var(--neutral-300))',
				'neutral-400': 'hsl(var(--neutral-400))',
				'neutral-500': 'hsl(var(--neutral-500))',
				
				// Semantic tokens
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				'none': '0',
				'sm': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '20px',
				'2xl': '24px',
				'full': '9999px',
				DEFAULT: '20px',
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
			},
			letterSpacing: {
				'heading': '-0.01em',
			},
			lineHeight: {
				'heading': '1.4',
				'heading-lg': '1.5',
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
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.6s ease-out forwards',
				'slide-up': 'slide-up 0.7s ease-out forwards',
				'scale-in': 'scale-in 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

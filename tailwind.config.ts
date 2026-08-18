import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'50': '#eef7ff',
  				'100': '#d9edff',
  				'200': '#bce0ff',
  				'300': '#8ecdff',
  				'400': '#59b0ff',
  				'500': '#338dff',
  				'600': '#1a6df5',
  				'700': '#1457e1',
  				'800': '#1747b6',
  				'900': '#193f8f',
  				'950': '#142857'
  			}
  		},
  		animation: {
  			'float-bg': 'floatBG 15s ease-in-out infinite',
  			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			floatBG: {
  				'0%, 100%': {
  					backgroundPosition: 'center center'
  				},
  				'50%': {
  					backgroundPosition: '70% 30%'
  				}
  			},
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 20px rgba(51, 141, 255, 0.3)'
  				},
  				'100%': {
  					boxShadow: '0 0 40px rgba(51, 141, 255, 0.6)'
  				}
  			},
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
  			}
  		}
  	}
  },
  plugins: [],
}

export default config

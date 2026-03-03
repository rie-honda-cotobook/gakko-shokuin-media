import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto)', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#8B1538',
          light: '#f5e8ec',
          dark: '#6b1028',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(139, 21, 56, 0.08), 0 4px 6px -2px rgba(139, 21, 56, 0.04)',
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(139, 21, 56, 0.08), 0 4px 6px -4px rgba(139, 21, 56, 0.04)',
      },
    },
  },
  plugins: [],
};
export default config;

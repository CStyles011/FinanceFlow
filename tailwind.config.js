/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#060816',
        panel: '#0e1428',
        muted: '#8fa4d0',
        line: '#1e2945',
        accent: '#4fd1c5',
        brand: '#7c9cff',
        success: '#45d483',
        danger: '#ff6b81',
        warning: '#f6c760'
      },
      boxShadow: {
        soft: '0 24px 60px rgba(3, 8, 22, 0.35)',
        glow: '0 0 0 1px rgba(124, 156, 255, 0.08), 0 18px 48px rgba(5, 12, 34, 0.45)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(124,156,255,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(79,209,197,0.12), transparent 24%)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./product/frontend/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": {
          100: "var(--color-brand-primary-100)",
          500: "var(--color-brand-primary-500)",
          "500-15": "var(--color-brand-primary-500-15)",
          700: "var(--color-brand-primary-700)",
        },
        "brand-secondary": {
          500: "var(--color-brand-secondary-500)",
          700: "var(--color-brand-secondary-700)",
          high: "var(--color-brand-secondary-high)",
        },
        "feedback-green": {
          50: "var(--color-feedback-green-50)",
          500: "var(--color-feedback-green-500)",
          "500-15": "var(--color-feedback-green-500-15)",
        },
        "feedback-yellow": {
          50: "var(--color-feedback-yellow-50)",
          500: "var(--color-feedback-yellow-500)",
          "500-15": "var(--color-feedback-yellow-500-15)",
        },
        "feedback-blue": {
          500: "var(--color-feedback-blue-500)",
          "500-15": "var(--color-feedback-blue-500-15)",
          600: "var(--color-feedback-blue-600)",
        },
        "neutral-grey": {
          50: "var(--color-neutral-grey-50)",
          100: "var(--color-neutral-grey-100)",
          200: "var(--color-neutral-grey-200)",
          300: "var(--color-neutral-grey-300)",
          400: "var(--color-neutral-grey-400)",
          500: "var(--color-neutral-grey-500)",
          600: "var(--color-neutral-grey-600)",
          700: "var(--color-neutral-grey-700)",
          800: "var(--color-neutral-grey-800)",
          900: "var(--color-neutral-grey-900)",
        },
        surface: {
          ground: "var(--color-surface-neutral-ground)",
          low: "var(--color-surface-neutral-low)",
          medium: "var(--color-surface-neutral-medium)",
          high: "var(--color-surface-neutral-high)",
          "success-low": "var(--color-surface-success-low)",
          "success-high": "var(--color-surface-success-high)",
          "warning-low": "var(--color-surface-warning-low)",
          "warning-high": "var(--color-surface-warning-high)",
          "danger-low": "var(--color-surface-danger-low)",
          "danger-high": "var(--color-surface-danger-high)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        chip: "var(--radius-chip)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        low: "var(--shadow-low)",
        top: "var(--shadow-top)",
        left: "var(--shadow-left)",
      },
      spacing: {
        1: "var(--sp-1)",
        2: "var(--sp-2)",
        3: "var(--sp-3)",
        4: "var(--sp-4)",
        5: "var(--sp-5)",
        6: "var(--sp-6)",
        8: "var(--sp-8)",
      },
      fontSize: {
        "title-lg": "var(--fs-title-lg)",
        "title-md": "var(--fs-title-md)",
        "title-sm": "var(--fs-title-sm)",
        "body-lg": "var(--fs-body-lg)",
        "body-md": "var(--fs-body-md)",
        "body-sm": "var(--fs-body-sm)",
        "body-xs": "var(--fs-body-xs)",
        caption: "var(--fs-caption)",
      },
      fontFamily: {
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        enter: "enter 0.6s ease-out forwards",
        pulseDot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

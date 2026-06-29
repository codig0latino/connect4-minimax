/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "primary": "#007bff",
        "on-primary": "#ffffff",
        "primary-container": "#e1f0ff",
        "on-primary-container": "#004a99",
        "secondary": "#ffd700",
        "on-secondary": "#332b00",
        "secondary-container": "#fff4cc",
        "on-secondary-container": "#665600",
        "tertiary": "#ff4d4d",
        "on-tertiary": "#ffffff",
        "error": "#ba1a1a",
        "surface": "#f5faff",
        "on-surface": "#191c1d",
        "surface-variant": "#e1e3e4",
        "on-surface-variant": "#454652",
        "outline": "#767683",
        "background": "#ffffff",
        "soft-sky": "#e0f2fe",
        "difficulty-easy": "#4ade80",
        "difficulty-medium": "#fb923c",
        "difficulty-hard": "#f87171",
        "difficulty-impossible": "#a855f7"
      },
      "borderRadius": {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "full": "9999px"
      },
      "spacing": {
        "slot-size-mobile": "44px",
        "slot-size-desktop": "80px",
        "stack-gap": "1.5rem",
        "container-padding": "2rem",
        "board-gap": "12px"
      },
      "fontFamily": {
        "headline-lg-mobile": ["Plus Jakarta Sans"],
        "label-caps": ["Plus Jakarta Sans"],
        "headline-lg": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"],
        "score-number": ["Plus Jakarta Sans"]
      },
      "fontSize": {
        "headline-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "800"}],
        "label-caps": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "headline-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "body-md": ["18px", {"lineHeight": "28px", "fontWeight": "500"}],
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
        "score-number": ["36px", {"lineHeight": "44px", "fontWeight": "800"}]
      }
    }
  },
  plugins: [],
}

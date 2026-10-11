/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,html}',
    './components/**/*.{js,ts,jsx,tsx,mdx,html}',
    './app/**/*.{js,ts,jsx,tsx,mdx,html}',
    './screens/**/*.html'

  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary":                    "var(--color-primary)",
        "on-primary":                 "var(--color-on-primary)",
        "primary-container":          "var(--color-primary-container)",
        "on-primary-container":       "var(--color-on-primary-container)",
        "primary-fixed":              "var(--color-primary-fixed)",
        "primary-fixed-dim":          "var(--color-primary-fixed-dim)",
        "on-primary-fixed":           "var(--color-on-primary-fixed)",
        "on-primary-fixed-variant":   "var(--color-on-primary-fixed-variant)",

        "secondary":                  "var(--color-secondary)",
        "on-secondary":               "var(--color-on-secondary)",
        "secondary-container":        "var(--color-secondary-container)",
        "on-secondary-container":     "var(--color-on-secondary-container)",
        "secondary-fixed":            "var(--color-secondary-fixed)",
        "secondary-fixed-dim":        "var(--color-secondary-fixed-dim)",
        "on-secondary-fixed":         "var(--color-on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",

        "tertiary":                   "var(--color-tertiary)",
        "on-tertiary":                "var(--color-on-tertiary)",
        "tertiary-container":         "var(--color-tertiary-container)",
        "on-tertiary-container":      "var(--color-on-tertiary-container)",
        "tertiary-fixed":             "var(--color-tertiary-fixed)",
        "tertiary-fixed-dim":         "var(--color-tertiary-fixed-dim)",
        "on-tertiary-fixed":          "var(--color-on-tertiary-fixed)",
        "on-tertiary-fixed-variant":  "var(--color-on-tertiary-fixed-variant)",

        "surface":                    "var(--color-surface)",
        "surface-dim":                "var(--color-surface-dim)",
        "surface-bright":             "var(--color-surface-bright)",
        "surface-container-lowest":   "var(--color-surface-container-lowest)",
        "surface-container-low":      "var(--color-surface-container-low)",
        "surface-container":          "var(--color-surface-container)",
        "surface-container-high":     "var(--color-surface-container-high)",
        "surface-container-highest":  "var(--color-surface-container-highest)",
        "surface-variant":            "var(--color-surface-variant)",
        "surface-tint":               "var(--color-surface-tint)",

        "on-surface":                 "var(--color-on-surface)",
        "on-surface-variant":         "var(--color-on-surface-variant)",
        "background":                 "var(--color-background)",
        "on-background":              "var(--color-on-background)",

        "outline":                    "var(--color-outline)",
        "outline-variant":            "var(--color-outline-variant)",

        "inverse-surface":            "var(--color-inverse-surface)",
        "inverse-on-surface":         "var(--color-inverse-on-surface)",
        "inverse-primary":            "var(--color-inverse-primary)",

        "error":                      "var(--color-error)",
        "on-error":                   "var(--color-on-error)",
        "error-container":            "var(--color-error-container)",
        "on-error-container":         "var(--color-on-error-container)",
      },

      borderRadius: {
        "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"
      },
      spacing: {
        "gutter-tablet": "1.25rem", "space-lg": "1.5rem", "gutter-mobile": "1rem", "margin-tablet": "2rem", "gutter": "1.5rem", "margin-mobile": "1.25rem", "space-xl": "2.5rem", "space-md": "1rem", "space-xs": "0.25rem", "margin": "4rem", "space-sm": "0.5rem"
      },
      fontFamily: {
        "sans": ["Poppins", "Cairo", "sans-serif"],
        "body-lg": ["Poppins", "Cairo", "sans-serif"], "headline-md": ["Poppins", "Cairo", "sans-serif"], "headline-lg": ["Poppins", "Cairo", "sans-serif"], "headline-sm": ["Poppins", "Cairo", "sans-serif"], "body-sm": ["Poppins", "Cairo", "sans-serif"], "label-lg": ["Poppins", "Cairo", "sans-serif"], "headline-lg-mobile": ["Poppins", "Cairo", "sans-serif"], "label-sm": ["Poppins", "Cairo", "sans-serif"], "label-md": ["Poppins", "Cairo", "sans-serif"], "body-md": ["Poppins", "Cairo", "sans-serif"], "display-lg-mobile": ["Poppins", "Cairo", "sans-serif"], "display-lg": ["Poppins", "Cairo", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.005em", "fontWeight": "400" }],
        "headline-md": ["28px", { "lineHeight": "36px", "letterSpacing": "0em", "fontWeight": "500" }],
        "headline-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.015em", "fontWeight": "500" }],
        "headline-sm": ["22px", { "lineHeight": "30px", "letterSpacing": "0em", "fontWeight": "600" }],
        "body-sm": ["13px", { "lineHeight": "20px", "letterSpacing": "0.005em", "fontWeight": "400" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "500" }],
        "label-sm": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "700" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.04em", "fontWeight": "600" }],
        "body-md": ["15px", { "lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-lg-mobile": ["38px", { "lineHeight": "46px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "600" }]
      }
    }
  }
};
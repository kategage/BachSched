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
        'tropical-turquoise': '#40E0D0',
        'tropical-aqua': '#00CED1',
        'tropical-coral': '#FF7F50',
        'tropical-sand': '#F5DEB3',
        'tropical-orange': '#FF6B6B',
        'tropical-cream': '#FFF9F0',
        'tropical-sky': '#F0F8FF',
        'tropical-teal': '#008B8B',
        'tropical-navy': '#1A365D',
      },
      fontFamily: {
        'tropical': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

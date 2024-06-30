import type {Config} from "tailwindcss";
// https://mui.com/material-ui/integrations/interoperability/#tailwind-css
const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // important: '#__next',
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    //Remove Tailwind CSS's preflight style so it can use the Material UI's preflight instead (CssBaseline)
    //https://tailwindcss.com/docs/preflight
    // modern-normalize
    corePlugins: {
        preflight: false
    },
    plugins: [],
};
export default config;

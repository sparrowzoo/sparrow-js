/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},//默认是postcss-nested 更好
        tailwindcss: {},
        autoprefixer: {},
    },
};

export default config;

/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},//默认是postcss-nested 更好
        tailwindcss: {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === 'production' ? {cssnano: {}} : {})
        //https://tailwindcss.com/docs/optimizing-for-production
    },
};

export default config;

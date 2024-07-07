# Customizing
## Centering by default
To center containers by default, set the center option to true in the theme.container section of your config file:
```
tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
theme: {
container: {
center: true,
},
},
}
```
## Adding horizontal padding
To add horizontal padding by default, specify the amount of padding you’d like using the padding option in the theme.container section of your config file:
```
tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
theme: {
container: {
padding: '2rem',
},
},
}
```
If you want to specify a different padding amount for each breakpoint, use an object to provide a default value and any breakpoint-specific overrides:
```
tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
theme: {
container: {
padding: {
DEFAULT: '1rem',
sm: '2rem',
lg: '4rem',
xl: '5rem',
'2xl': '6rem',
},
},
},
};
```
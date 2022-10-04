/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			grayscale: {
				50: '50%',
				75: '75%'
			}
		}
	},
	plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(closest-side, var(--tw-gradient-stops))",
			},
			colors: {
				primary: "#4DCBEB",
				secondary: "#36F0CF",

				title: "#D5DBF9",
				subtitle: "#8A91B5",
				body: "#C7CBE0",

				background: "#242839",
				card: "#2A2F45",
				"card-hover": "#303551",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				mono: ["Fira Code", "monospace"],
			},
		},
	},
	plugins: [require("@tailwindcss/container-queries"), require("@tailwindcss/line-clamp")],
};

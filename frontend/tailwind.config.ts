import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				custom: ['NotoSansMono', 'monospace']
			}
		}
	},

	plugins: []
} satisfies Config;

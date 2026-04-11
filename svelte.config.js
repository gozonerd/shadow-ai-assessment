import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries.
		// Function form (not boolean) prevents forcing runes on node_modules
		// which can break Svelte 4-style library components.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		})
	}
};

export default config;

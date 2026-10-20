// Nuxt 4 (app/ srcDir is the default). See docs/06-frontend-nuxt.md.
export default defineNuxtConfig({
	compatibilityDate: "2026-08-20",
	devtools: { enabled: true },
	modules: ["@nuxt/ui"],
	colorMode: {
		preference: "dark",
		fallback: "dark",
		classSuffix: "",
	},
	ssr: true,
	css: ["~/assets/css/main.css"],

	nitro: {
		rollupConfig: {
			output: {
				banner: (() => {
					const mappings = {
						LCC_API_URL: "API_URL",
						LCC_APP_URL: "APP_URL",
					};

					const bannerCode = `
						(function () {
							const mappings = ${JSON.stringify(mappings)};
							const env = globalThis.process?.env ?? {};
							for (const [envName, runtimeName] of Object.entries(mappings)) {
								if (!env['NUXT_PUBLIC_' + runtimeName] && env[envName]) {
									env['NUXT_PUBLIC_' + runtimeName] = env[envName];
								}
							}
						})();
					`;

					return bannerCode.replace(/^\s+|\s+$/g, "").replace(/\n\s*/g, " ");
				})(),
			},
		},

		esbuild: {
			options: {
				target: "esnext",
			},
		},
	},

	runtimeConfig: {
		public: {
			apiUrl: process.env.LCC_API_URL || "http://localhost:12550",
			appUrl: process.env.LCC_APP_URL || "http://localhost:12560",
		},
	},

	telemetry: false,
});

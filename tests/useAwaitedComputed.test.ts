/// <reference types="bun-types/test.d.ts" />
import { describe, expect, test } from "bun:test";
import * as vue from "vue";
import { renderToString } from "vue/server-renderer";
import { useAwaitedComputed } from "../app/composables/useAwaitedComputed";

function renderWith(getter: () => Promise<string>) {
	const Page = vue.defineComponent({
		async setup() {
			// Like the subrouter parents: an earlier top-level await before the composable.
			await Promise.resolve();
			const value = await useAwaitedComputed(getter);
			return () => vue.h("p", value.value);
		},
	});
	return renderToString(vue.createSSRApp(Page));
}

describe("useAwaitedComputed", () => {
	test("resolves during SSR, where Vue stops the effect after its first run", async () => {
		const html = await renderWith(async () => {
			await new Promise((resolve) => setTimeout(resolve, 5));
			return "loaded";
		});
		expect(html).toContain("loaded");
	});

	test("rejects instead of hanging when the first run fails", async () => {
		const failing = renderWith(async () => {
			throw new Error("boom");
		});
		await expect(failing).rejects.toThrow("boom");
	});
});

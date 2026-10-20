/**
 * useAwaitedComputed — an async `computed()`.
 *
 * Pass a getter that returns a `Promise<T>`; it returns a `ComputedRef<T>` that resolves to the
 * latest value and updates whenever its reactive dependencies change. Awaits the first run before
 * returning so the initial value is populated. See docs/07-state-and-data.md.
 */
import {
	type ComputedGetter,
	type ComputedRef,
	computed,
	type DebuggerOptions,
	ref,
	type WritableComputedOptions,
	type WritableComputedRef,
	watchEffect,
} from "vue";

export function useAwaitedComputed<T>(
	getter: ComputedGetter<Promise<T>>,
	debugOptions?: DebuggerOptions,
): Promise<ComputedRef<T>>;

export function useAwaitedComputed<T, S = T>(
	options: WritableComputedOptions<Promise<T>, S>,
	debugOptions?: DebuggerOptions,
): Promise<WritableComputedRef<T, S>>;

export async function useAwaitedComputed<T, S = T>(
	source: ComputedGetter<Promise<T>> | WritableComputedOptions<Promise<T>, S>,
	debugOptions?: DebuggerOptions,
): Promise<ComputedRef<T> | WritableComputedRef<T, S>> {
	const state = ref<T>() as { value: T };

	let resolveFirst!: () => void;
	let rejectFirst!: (error: unknown) => void;
	const firstRun = new Promise<void>((resolve, reject) => {
		resolveFirst = resolve;
		rejectFirst = reject;
	});
	let initialized = false;

	const getter = typeof source === "function" ? source : source.get;

	// Only a newer run makes a result stale. Don't use `onCleanup` for that: during SSR Vue runs
	// the effect once and stops it right away, which would drop the first (and only) result and
	// leave `firstRun` pending forever.
	let latestRun = 0;

	watchEffect(async () => {
		const run = ++latestRun;

		let value: T;
		try {
			value = await getter();
		} catch (error) {
			if (!initialized) rejectFirst(error);
			else console.error("useAwaitedComputed: getter failed", error);
			return;
		}
		if (run !== latestRun) return;

		state.value = value;

		if (!initialized) {
			initialized = true;
			resolveFirst();
		}
	}, debugOptions);

	await firstRun;

	if (typeof source === "function") {
		return computed(() => state.value);
	}

	return computed({
		get: () => state.value,
		set: source.set,
	});
}

<script setup lang="ts">
usePageSeo({
	title: "Players — LeiCraft Client",
	description: "Look up a Minecraft player and see the capes and cosmetics they wear.",
});

const name = ref("");

async function search() {
	const value = name.value.trim();
	if (!/^[A-Za-z0-9_]{1,16}$/.test(value)) return;
	await navigateTo(`/players/${encodeURIComponent(value)}`);
}
</script>

<template>
	<UContainer class="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
		<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10">
			<UIcon name="i-lucide-users" class="text-3xl text-primary-400" />
		</div>
		<div>
			<h1 class="text-3xl font-bold text-white">Find a player</h1>
			<p class="mt-2 text-slate-400">
				See what someone wears with the LeiCraft Client. Players show up once they played with the
				mod.
			</p>
		</div>
		<form class="flex w-full max-w-md gap-2" @submit.prevent="search">
			<UInput
				v-model="name"
				icon="i-lucide-search"
				placeholder="Minecraft name"
				size="lg"
				class="flex-1"
				:maxlength="16"
				autofocus
			/>
			<UButton type="submit" size="lg">Search</UButton>
		</form>
	</UContainer>
</template>

<template>
	<section class="relative overflow-hidden py-24">
		<div
			class="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-primary-500/5 to-transparent"
			aria-hidden="true"
		></div>

		<UContainer class="relative z-10">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold text-balance text-white sm:text-4xl lg:text-5xl">
					Ready to stand out on
					<span class="bg-linear-to-tr from-primary-400 to-primary-200 bg-clip-text text-transparent">
						every
					</span>
					server?
				</h2>
				<p class="mb-8 text-lg text-pretty text-slate-400">
					Install the mod, log in with Discord, pick a cape. Free, open source, and next to the client you
					already play with.
				</p>
				<div class="flex flex-col justify-center gap-3 sm:flex-row">
					<UButton to="/download" size="xl" icon="i-lucide-download" class="justify-center px-8">
						Download
					</UButton>
					<UButton
						to="/docs/getting-started/quick-start"
						size="xl"
						color="neutral"
						variant="outline"
						icon="i-lucide-book-open"
						class="justify-center px-8"
					>
						Quick start guide
					</UButton>
				</div>
			</div>
		</UContainer>
	</section>
</template>

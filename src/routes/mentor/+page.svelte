<script lang="ts">
	import MentorCard from '$lib/components/MentorCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Mentor | Future Nexus</title>
	<meta
		name="description"
		content="Kenali mentor alumni SMANWAY: kampus, jurusan, angkatan, dan topik keahlian mereka."
	/>
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Mentor</span>
		<h1>Kenalan dengan mentormu</h1>
		<p>Alumni SMANWAY dari berbagai kampus dan jurusan yang siap berbagi pengalaman.</p>
	</header>

	{#if data.mentors.length > 0}
		<div class="grid grid-2">
			{#each data.mentors as mentor (mentor.id)}
				<MentorCard {mentor} />
			{/each}
		</div>
	{:else}
		<p class="empty">Profil mentor akan segera ditambahkan.</p>
	{/if}
</div>

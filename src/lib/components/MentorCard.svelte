<script lang="ts">
	import Avatar from './Avatar.svelte';
	import type { Mentor } from '$lib/types';

	let { mentor }: { mentor: Mentor } = $props();
</script>

<article class="card mentor">
	<div class="head">
		<Avatar src={mentor.photo_url} name={mentor.name} size={72} />
		<div>
			<h3>{mentor.name}</h3>
			<p class="muted small">
				{mentor.major}
				{#if mentor.batch_year}&middot; Angkatan {mentor.batch_year}{/if}
			</p>
			<p class="campus small">{mentor.campus}</p>
		</div>
	</div>

	{#if mentor.expertise?.length}
		<div class="tags" aria-label="Keahlian">
			{#each mentor.expertise as topic (topic)}
				<span class="badge tag">{topic}</span>
			{/each}
		</div>
	{/if}

	{#if mentor.bio}
		<p class="bio small muted">{mentor.bio}</p>
	{/if}
</article>

<style>
	.head {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 0.9rem;
	}
	.head h3 {
		margin: 0;
	}
	.head p {
		margin: 0;
	}
	.campus {
		font-weight: 600;
		color: var(--primary-dark);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}
	.bio {
		margin: 0;
	}
</style>

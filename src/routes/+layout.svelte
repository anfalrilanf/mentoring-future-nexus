<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Mentoring Future Nexus | Mentoring Alumni SMANWAY</title>
	<meta
		name="description"
		content="Platform mentoring dari komunitas alumni SMANWAY untuk membantu siswa mempersiapkan diri menuju perguruan tinggi dan dunia perkuliahan."
	/>
</svelte:head>

<Navbar loggedIn={!!data.user} profile={data.profile} />
<main>
	{@render children()}
</main>
<Footer />

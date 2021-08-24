import App from './App.svelte';
import songs from '../data/dist/songs.json'


const app = new App({
	target: document.body,
	props: {
		songs: songs.filter(s => s.lyrics.length)
	}
});

export default app;

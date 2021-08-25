<script>
import Input from "./components/Input.svelte"
import Slider from "./components/Slider.svelte"
import {rand, sample, between} from '../scripts/utils.js'

export let songs

let text = []
let error
let count
let subset

let config = {
	n: 0,
	words: {
		min: 5,
		max: 200,
		range: [5, 200]
	},
	years: {
		min: 1962,
		max: 2020,
		range: [1962, 2020]
	},
	tags: false,
	headings: true,
	markdown: false,
	annotations: true,
}

const wrap = (str,a,b) => `${a}${str}${b}`
	
// Format array of songlines into punctuated sentences
const format = a =>
	a.map((str, i) => {
		if (i === a.length - 1) str.replace(/[,;]$/, ".")
		return str.match(/[^,!?:;\.(\.”)(\.")]$/) ? `${str}.` : str
	})
	.join(" ")

// Copy result to clipboard
const copy = () => {
	let content = text
		.map(p => 
			format(p.text)
		)

	navigator.clipboard.writeText(content)
}

// Extract songs released within selected years
const filterByYear = () => {
	let list = songs.filter(s => between(config.years.min, config.years.max, s.year))
	error = !list.length
	return list
}

// Extract paragraph from song
const extract = (song) => {

	let validParagraphs = song.lyrics.filter((p,i) => {
		let wordcount = p.join().split(" ").length
		return between(config.words.min, config.words.max, wordcount)
	})

	// If no paragraphs pass validity test
	// Merge all lyrics and slice to somewhere within range
	if (!validParagraphs.length) {
		let n = config.words.min + (config.words.max - config.words.min) * Math.random()
		return song.lyrics
			.flat()
			.map(str => str + "###")
			.join(" ")
			.split(" ")
			.slice(0, n.toFixed(0))
			.join(" ")
			.split("###")
	}
	
	return sample(validParagraphs)
}
	
const find = () => {
	let song = sample(subset)
	return Object.assign(song, {text: extract(song)}) 
}

const write = (n) => {
	config.n = n
	subset = filterByYear()
	if (error) return
	
	text = new Array(n)
		.fill(0)
		.map(() => find())
}
	
</script>

<aside>
	
	<div id="title" class="flex-center flex">
		<h1>Dylan Ipsum</h1>
		<svg height="110" viewBox="0 0 100 100">
			<circle cx=50 cy=50 r=40 fill=none stroke=white/>
		</svg>
	</div>
	
	<nav>
		<a href="">About</a>
		<a href="">Suggestions</a>
		<a href="https://github.com/brodysmith1/dylan-ipsum" target="_blank">Github</a>
		<a id="coffee" href="https://www.buymeacoffee.com/brods" target="_blank">
			One more cup of coffee
		</a>
	</nav>
	
	<hr>
	
	<div id="inputs">
		<Input label="paragraphs">
			<div class="button-row w-full">
				{#each new Array(10) as b, i}
					<button
						on:click={() => write(i + 1)}
						class:active={config.n === i + 1}
					>
						{i + 1}
					</button>
				{/each}
			</div>
		</Input>

		<Input
			label="paragraph length"
			range="{config.words.min}–{config.words.max}"
		>
			<Slider
				id="words"
				track={config.words.range}
				bind:min={config.words.min}
				bind:max={config.words.max}
				on:end={() => write(config.n)}
			/>
		</Input>
		
		<Input
			label="years"
			range="{config.years.min}–{config.years.max}"
		>
			<Slider
				id="years"
				track={config.years.range}
				bind:min={config.years.min}
				bind:max={config.years.max}
				on:end={() => write(config.n)}
			/>
		</Input>
	</div>
	
	<hr>
	
	<div class="flex flex-wrap">
		<input id="in-4" type="checkbox" bind:checked={config.annotations}>
		<label for="in-4">Annotations?</label>
		<input id="in-1" type="checkbox" bind:checked={config.headings}>
		<label for="in-1">Headings?</label>
		<input id="in-3" type="checkbox" bind:checked={config.tags}>
		<label for="in-3">HTML?</label>
	</div>
	
	<hr>
		
	<button class="border" on:click={copy}>
		Copy all to clipboard
	</button>
	
</aside>

<main>
	<article>
		{#if !error}
			{#if !text.length}
				<p>A random text generator that uses only Bob Dylan lyrics.</p>
				<p>Lyrics sourced from the 677 songs listed on
					<a href="https://www.bobdylan.com/" target="_blank">bobdylan.com</a>.
				</p>
				<p>
					<button
						class="red border"
						on:click={() => write(10)}
					>
						Get born
					</button>
				</p>
			{:else}
				{#each text as quote, i (i)}
					{#if config.headings && !(i % 3)}
						<h2>
							{#if config.tags}
								{wrap(quote.title,"<h2>","</h2>")}
							{:else}
								{quote.title}
							{/if}
						</h2>
					{/if}
					<p>
						{#if config.tags}
							{wrap(format(quote.text),"<p>","</p>")}
						{:else}
							{format(quote.text)}
						{/if}
						{#if config.annotations}
							<span class="annotation">
								<em>{quote.title}</em><br>
								{quote.album} ({quote.year})
							</span>
						{/if}
					</p>
				{/each}
			{/if}
		{:else}
			No albums released
			{config.years.max - config.years.min ? [config.years.min,config.years.max].join("–") : "in " + config.years.max}.
		{/if}
	</article>

</main>

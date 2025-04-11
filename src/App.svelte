<script>
import { tick } from 'svelte'
import { fade } from 'svelte/transition'
import { submit } from '../scripts/form'
import { format, wrap } from '../scripts/string'
import { sample, between, on } from '../scripts/utils'

import Input from "./components/Input.svelte"
import Modal from "./components/Modal.svelte"
import Slider from "./components/Slider.svelte"

export let songs

let vw
let text = []
let form
let error
let count
let subset
let active
let copied
let timeout
let submitted
let highlight
let formerror

let modalAbout
let modalSuggest

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
	copy: true,
	html: false,
	headings: true,
	annotations: true,
}

let tooltip = {
	text: "Copied text!",
	active: false,
	duration: 1000,
	hide: async (e) => {
		await tick()
		e && followPointer(e, tooltip.element)
		tooltip.active = false
	}
}

// Suggestion form event handler
const onSubmit = e => {
	let data = submit(e)
	
	if (data.error) {
		formerror = data.error
	} else {
		submitted = true
		formerror = false
	}
}

// Toggle menu, for mobile only
const menu = (e) => {
	if (mobile) {
		e && e.preventDefault()
		active = !active
	}
}

// For tooltip, bind position to pointer 
const followPointer = (ev, el) => {
	el.style.top	= ev.clientY + "px"
	el.style.left = ev.clientX + "px"
}

// Copy result to clipboard
const copy = async (e, inv) => {
	if (!text.length || !(config.copy ^ inv) ) return
	
	let content, unfollowPointer
	
	tooltip.text = "Copied text!"
	tooltip.active = true
	highlight = true
	await tick()

	followPointer(e, tooltip.element)
	unfollowPointer = on(
		document.body,
		'pointermove',
		(e) => followPointer(e, tooltip.element)
	)
	
	content = text
		.map((song,i) =>
			!(i % 3) && config.headings
				? [song.title, format(song.text)]
				: format(song.text)
		)
		.flat()
		.map((p,i) => config.html
				? (i % 4)
					? wrap(p,"<p>","</p>")
					: wrap(p,"<h2>","</h2>")
				: p
		)
		.join("\r\n\r\n")
	
	navigator.clipboard.writeText(content)
	tooltip.hide()
	
	clearTimeout(timeout)
	setTimeout(unfollowPointer, tooltip.duration)
	timeout = setTimeout(() => highlight = false, tooltip.duration)
}

// Extract songs released within selected years
const filterByYear = () => {
	let list = songs.filter(s => between(config.years.min, config.years.max, s.year))
	error = !list.length
	return list
}

// Extract a random paragraph from song
// If no verses pass the length validity test,
// Merge all verses and slice the length to be within range
const extract = (song) => {

	let validParagraphs = song.lyrics.filter((p,i) => {
		let wordcount = p.join().split(" ").length
		return between(config.words.min, config.words.max, wordcount)
	})

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

// Pluck a random song within year range
const find = () => {
	let song = sample(subset)
	return Object.assign(song, {text: extract(song)}) 
}

// Update text to n paragraphs from n randomly selected songs
// Copy result to clipboard and if on mobile, close the menu
const write = (e, n, toggleMenu) => {
	config.n = n
	subset = filterByYear()
	if (error) return
	
	text = new Array(n)
		.fill(0)
		.map(() => find())
		
	copy(e)
	
	if (mobile && toggleMenu) {
		tooltip.active = true
		tooltip.text = "Comin’ right up!"
		setTimeout(menu, 600)
		tooltip.hide(e)
	}
	
	window.scrollTo({
	  top: 0,
	  left: 0,
	  behavior: 'smooth'
	})
}

$: mobile = vw < 1000
	
</script>

<svelte:window bind:innerWidth={vw} />

<aside class:active>

	<div
		id="title"
		class="flex-center flex bare"
		href="/"
	>
		<h1>Dylan Ipsum</h1>
		<svg
			height="90"
			viewBox="0 0 193.7 192.6"
			on:click={menu}
			fill="white"
		>
		  <path d="M78 85l1 1v-2l-1 1zM123 126v-1l-1 1h1zM79 51v-1 1z"/>
		  <path d="M89 70v0c0-4-1-8-7-8l-5-5-3-5c-5 7-10 27-1 29 3 5 4-1 6 0l1-3 2 2c2 5 15 1 23 10 8-9-9-18-16-20zM75 56c-1 0-1-1 0 0zm8 24zm20 5l1 1-1-1zM194 119h-1 1zM77 51h-1 1zM77 53zM125 167h0zM125 124h-1 1zM144 116zM155 172c-4 1-9 5-10 9l4-2c3-2 5-4 6-7zM129 156h1-1z"/>
		  <path d="M114 184l1 3v4-1 1l16-4c2-2 3-2 4-1l5-2c-8-5-5-9 1-14 4 11 34-29 35-37-9 1-15 12-22 17v0c-6 0-2 14-12 16-3 4-5 0-8 0-4 5-1 17-10 14l-1 1v1h-1l-1-2 2 1h1c-6-7-11-10-10 1-4-4 1-10 3-15l1 5 6-3-5-5 6-1c-6-6-9 3-15 4l1-2c-5 0-9 2-13 3l-1-2c3 0 6-3 8-5h-1 1l4-3v-1-1 1l9-2-2-2c6-2 6-7 7-13 0-3-3-10 2-10 0-2-1-3-3-4 2-6-3-7-1-13h-2v0h2l1-1s1 0 0 0h1l-2-2-8-7-1 1v2-2l1-1v-2h-2c1-4-4-5-7-8-2-2-4 2-7 2v2c4 4-2 13-5 14-10 0-15-25-22-18-6 11-16 36 7 22h-1 1c7 5-20 14 9 21-15 12-1 10 6 17-5 3-2 7 0 10h-1l5 5c-9-3-8-13-16-18-2-1-2-5-3-8 1-5-4-6-7-8l1-2-2-5-1 1v-1l-1-1c-4-3-9-6-10-12v-1 1l-2-2 2-1c0-2 0-4 2-5h-2l6-13-1-2v-1 1c4-4 1-8 0-13h-1 1l-1-7c-1-2 2-7-3-7l4-2c-5-1-14-14-7-14-6-9 0-19 3-28l2-5h-1 1c3-5 9-9 10-15a99 99 0 0044 192v-8zm5-14v0zm2-29zm-1-20zm-5 14h0zm2-2zm1 14v1-1zm0-29h-1 1zm-1-2v-1 1zm0-4h-2 2zm-2 13zm-1 16zm-1 11v0zm-2-44c1 0 1 0 0 0zm-2 21v-1 1-1 1zm0-29h-1 1zm0 4h-1 1-1 1zm-4 44l-1 1v-1h1zm-3-50l-1-1c2-2 3-1 1 1zm-25 25l-1-2 1 2zm2-13zm0 3v-1 1zm2 4l-1-1h1v1zm0-5h1-1zm5 34v-1l2 2c-1 1-1 0-2-1zm5 1h-1 1zM54 19v0zm-1 12zM39 62v-1 1zm6-21zm6 4l-1-1h1v1zm3 14v0zm-1 10c1-1 1-2 2-1-1 1-1 2-2 1zm8 59zm6 14zm0 1v-1 1zm6-5zm23 32h-1l1-3c0 1 0 0 0 0v3zm16 3l-1-1 1 1v-1l-1-1h1v2zm0-5zM126 174zM114 161zM118 154z"/>
		  <path d="M123 144h1l-1-1v1zM122 158h0zM115 163l-1-2v2h1zM63 68l-2 2c1-1 3-1 2-2zM123 173c1-1 0-1 0 0zM55 48zM124 139zM87 155c-1 0 0 1 0 0zM123 177v0zM119 174zM140 175zM123 177z"/>
		</svg>
	</div>
	
	<a id="coffee" class="bare upper" href="https://www.buymeacoffee.com/brods" target="_blank">
		One more cup of coffee
	</a>
	
	{#if !mobile || active}
	
		<nav>
			<a
				on:click|preventDefault={() => modalAbout = true}
				href="javascript:;"
			>About</a>
			<a href="https://github.com/brodysmith1/dylan-ipsum" target="_blank">Github</a>
			<a href="/tools">More tools</a>
		</nav>
		
		<hr>
		
		<div class="scroller">
			<div class="scroller-inner">
				<div id="inputs">
					<Input label="paragraphs">
						<div class="button-row w-full">
							{#each new Array(10) as b, i}
								<button
									on:click={(e) => {write(e, i + 1, true)}}
									class:active={config.n === i + 1}
								>
									{i + 1}
								</button>
							{/each}
						</div>
					</Input>

					<Input
						label="paragraph length"
						className="p-4"
						range="{config.words.min}–{config.words.max}"
					>
						<Slider
							id="words"
							track={config.words.range}
							bind:min={config.words.min}
							bind:max={config.words.max}
							on:end={(e) => write(e, config.n)}
						/>
					</Input>
					
					<Input
						label="years"
						className="p-4"
						range="{config.years.min}–{config.years.max}"
					>
						<Slider
							id="years"
							track={config.years.range}
							bind:min={config.years.min}
							bind:max={config.years.max}
							on:end={(e) => write(e, config.n)}
						/>
					</Input>
				</div>
			
				<hr>
				
				<div class="toggles flex flex-wrap">
					<input id="in-1" type="checkbox" bind:checked={config.annotations}>
					<label for="in-1">Song labels</label>
					<input id="in-2" type="checkbox" bind:checked={config.headings} on:click={copy}>
					<label for="in-2">Headings</label>
					<input id="in-4" type="checkbox" bind:checked={config.copy} on:click={(e) => copy(e, true)}>
					<label for="in-4">Autocopy</label>
					<input id="in-3" type="checkbox" bind:checked={config.html} on:click={copy}>
					<label for="in-3">HTML</label>
				</div>
			</div>
		</div>
	{/if}
	
</aside>

<main>
	<article class:highlight>
		{#if !error}
			{#if !text.length}
				<div id="introduction">
					<h2>Fill your designs with the greatest lyrics ever written.
						<span class="annotation">And maybe some of the worst. With 677 songs there's bound to&nbsp;be some stinkers.</span>
					</h2>
					<hr class="dark">
					<p>Use this tool to generate random text packed with poetic genius. Or just put your Dylan knowledge to the test and explore his incredible catalogue in a new way.</p>
					<p>
						All lyrics from Bob’s 677 songs are pulled from
						<a href="https://www.bobdylan.com/" target="_blank">bobdylan.com</a> —
						from 1962’s <em>Bob Dylan</em> through to 2020’s <em>Rough and Rowdy Ways</em>.
					</p>
					<p>So, know your songs well before you start singing. Because something is happening here, and it’s time you learn what it is.</p>
					<p>Also available as an <a href="https://github.com/brodysmith1/dylan-ipsum-npm" target="_blank">npm package</a>, if that's your thing.</p>
				</div>
			{:else}
				{#each text as quote, i (i)}
					{#if config.headings && !(i % 3)}
						<h2>
							{#if config.html}
								{wrap(quote.title,"<h2>","</h2>")}
							{:else}
								{quote.title}
							{/if}
						</h2>
					{/if}
					<p>
						{#if config.html}
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
			{#if text.length}<hr class="dark">{/if}
			<button
				class="btn-red upper"
				on:click={(e) => write(e, config.n || 10)}
			>
				{text.length ? "Give me another" + (config.n > 1 ? " " + config.n : "" ) : "Get born"}
			</button>	
		{:else}
			No albums released
			{config.years.max - config.years.min ? [config.years.min,config.years.max].join("–") : "in " + config.years.max}.
		{/if}
	</article>
</main>

{#if tooltip.active}
	<div
		id="tooltip"
		bind:this={tooltip.element}
		out:fade|global={{duration: 300, delay: tooltip.duration - 200}}
	>
		{tooltip.text}
	</div>
{/if}

{#if false}
	<Modal close={() => modalSuggest = false}>
		<h2>What to do with a database of Dylan lyrics?</h2>
		<p>
			Now, Bob, I ain’t lookin’ to analyze you, categorize you, finalize you or advertise you.
			But this was a fun project and I am lookin’ to create new ways for people to engage with your work.
		</p>
		<p>Got an idea for new feature or platform? Just want to say hello? I might be in Tangier, but try me:</p>
		<hr>
		{#if !submitted}
			<form
				class="gform"
				bind:this={form}
				on:submit={onSubmit}
			>
				<label type="text">Name
					<input name="name" type="text" placeholder="Robert Zimmerman">
				</label>
				<label type="text">Email
					<input name="email" type="text" placeholder="dylan@budokan.com">
				</label>
				<label type="text">Suggestion
					<textarea name="message" rows=4 placeholder="Give me some milk or else go home."></textarea>
				</label>
				{#if formerror}
					<p class="upper" style="color: #ff9; margin: 0 0 .5rem">{formerror}</p>
				{/if}
				<button class="border btn-red upper">
					Step it up and go
				</button>
			</form>
		{:else}
			<div id="formsubmit">
				<p>Thanks. Now don’t send me no more letters, no. Not&nbsp;unless&nbsp;you&nbsp;mail them from Desolation Row.</p>
			</div>
		{/if}
	</Modal>
{/if}

{#if modalAbout}
	<Modal close={() => modalAbout = false}>
		<p>Bob's catalogue includes 136,392 words, 520 mentions of <b>love</b>, 52 mentions of <b>law</b>, and 5 mentions of <b>country pie</b>. <span style="font-size: 12px; opacity: 0.5;">(Note: 188/677 songs on <a href="https://www.bobdylan.com/songs" target="_blank">bobdylan.com</a> have no lyrics listed.)</span></p>
		<p>
			<span class="border">Brody Smith 👨‍💻</span> had a whopping good time building this website. If you have any ideas to make this site better, please reach out on his <a href="https://brody.fyi/">website</a>.
		</p>
		<p>Dylan Ipsum is also available as an <a href="https://github.com/brodysmith1/dylan-ipsum-npm" target="_blank">npm package</a>, if that's your thing.</p>
		<a class="bare" download href="/tools/dylan-ipsum/downloads/songs.json"><button class="border" style="margin-top: 1.75rem;">Download json file of all lyrics &darr;</button></a>
	</Modal>
{/if}

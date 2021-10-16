# Dylan Ipsum: Generate random Bob Dylan lyrics

This is the codebase for the [dylanlyrics.app](https://www.dylanlyrics.app/) website.
Also available as an [npm package](https://github.com/brodysmith1/dylan-ipsum-npm) for easy integration into your web projects.

<hr>

Use this tool to generate random text packed with poetic genius. Or just put your Dylan knowledge to the test and explore his incredible catalogue in a new way.

All lyrics from Bob’s 677 songs are pulled from bobdylan.com — from 1962’s Bob Dylan through to 2020’s Rough and Rowdy Ways.

If you want to show some ❤️ for this project, you can buy <a href="https://www.buymeacoffee.com/brods">one more coffee for the road</a>.

### Run the website in development mode

```
npm run dev
```

### Build and run in production mode

To create an optimised version of the app:

```
npm run build
```

### Download the songs database

First step is to <a href="https://www.dylanlyrics.app/downloads/songs.json" download>download the JSON file</a>.

If there are future releases or updates to <a href="https://www.bobdylan.com/">Bob's website</a> and you'd like to rescrape, you can do so via `data/scrape.js`. Please run this responsibly and only if you absolutely need to:

```
npm run scrape
```

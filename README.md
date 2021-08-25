# Dylan Ipsum: Placeholder text using only Bob Dylan lyrics.


## Scrape the data

```bash
npm run scrape
```

## Run in dev mode

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Build and run in production mode

To create an optimised version of the app:

```bash
npm run build
```

Run the newly built app with `npm run start`.

## Steps to recreate

1. Start new Svelte template repo
2. Install required packages ([node-fetch](https://www.npmjs.com/package/node-fetch), [jsdom](https://www.npmjs.com/package/jsdom))


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

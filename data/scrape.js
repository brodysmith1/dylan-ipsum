/*------------------------/

  Write a json array with entry for each Dylan song to songs.json:
  { url, album, year, title, plays, lyrics }
  
/------------------------*/

const fs = require ('fs')
const jsdom = require('jsdom')
const fetch = require('node-fetch')

const { JSDOM } = jsdom
const songsURL = "https://www.bobdylan.com/songs"
const albumURL = "https://www.bobdylan.com/albums"

const get = (s,p) => p.querySelector(s)
const getAll = (s,p) => p.querySelectorAll(s)

let item, url, album
let data = []
let albums = {}

const getSongs = async () => {
  let dom  = await parse(songsURL)
  let rows = getAll('#item-list .line', dom.window.document)

  console.log(`Getting data from ${rows.length} songs ...`)

  for (const [i,row] of rows.entries()) {
    url = get(".song a", row).getAttribute('href')
    album = get(".release a", row).textContent
    
    item = Object.assign({}, {
      url,
      album,
      year: albums[album],
      title:  get(".song a", row).textContent,
      plays: +get(".times.played",row).textContent,
      lyrics: await getLyrics(url),
    })
    
    console.log(`Loaded song ${i+1} of ${rows.length}`)
    data.push(item)
  }
  
  fs.writeFileSync('./data/dist/songs.json', JSON.stringify(data, null, 2))
}

// scrape and tidy the lyrics from a given song url
// output into a 2D array: [paragraph[line]]
const getLyrics = async url => {
  let dom = await parse(url)
  let doc = dom.window.document
  getAll('p', doc).forEach(p => p.remove()) // remove meta text
  return get('.lyrics', doc).textContent
    .split('\n\n')
    .map(para => para
      .trim()
      .split('\n')
      .map(line => line.trim())
    )
}

// create an object of all albums and their release year
const getAlbums = async () => {
  let dom = await parse(albumURL)
  let doc = dom.window.document
  getAll('.caption', doc).forEach(el =>
    albums[get('h3 a', el).textContent] = +get('.year', el).textContent
  )
  fs.writeFileSync('./data/dist/albums.json', JSON.stringify(albums, null, 2))
}

const parse = async url => {
  let page = await fetch(url)
  let html = await page.text()
  return new JSDOM(html)
}

getAlbums().then(() => getSongs())

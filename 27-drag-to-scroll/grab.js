const fetch = require('node-fetch');
const http = require('https');
const fs = require('fs');

// fetch pokemon list
const main = async () => {
  const limit = 33;
  const pokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`)
    .then(r => r.json())
    .then(r => r.results);

  // console.log(pokemons);

  // for each pokemon - save image and add to set
  pokemons.forEach(pok => {
    const id = pok.url.match(/\/(\d+)\/$/)[1];

    pok.id = id;
    pok.image = `images/${id}.png`;

    saveImage(id);
  });

  fs.writeFileSync('pokemons.json', JSON.stringify(pokemons));
}

const saveImage = (id) => {
  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  console.log('start to save:', imgUrl);
  return http.get(imgUrl, resp => resp.pipe(fs.createWriteStream(`images/${id}.png`)));
}

main();
import { getPokemon, getPokemonList } from "./apiRequest.mjs";

async function makeCard(name) {
  const pokemon = await getPokemonList();
  for (let i = 0; i < pokemon.length; i++) {
    const data = await getPokemon(pokemon[i]);
    createCard(data);
  }
}

async function pokemonStats(data) {
  if (!data) {
    console.error("Data is undefined");
    return;
  }
  console.log(data);
  const stats = {
    hp: data[0].base_stat,
    attack: data[1].base_stat,
    defense: data[2].base_stat,
    special_attack: data[3].base_stat,
    special_defense: data[4].base_stat,
    speed: data[5].base_stat,
  };

  console.log(stats);

  const ctx = document.getElementById("stats").getContext("2d");

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: Object.keys(stats),
      datasets: [
        {
          label: "Base Stats",
          data: Object.values(stats),
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(255, 99, 132)",
        },
      ],
    },
    options: {
      scale: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  });
}


function showPokemonStats(name) {
  swal.fire({
    title: "Loading...",
    onBeforeOpen: () => {
      swal.showLoading();
    },
  });
  getPokemon(name)
    .then((data) => {
      console.log(data.stats);
      swal.close();
      Swal.fire({
        title: data.name,
        html: `
            <img src="${data.image}" alt="${data.name}" />
            <p>Height: ${data.height}</p>
            <p>Weight: ${data.weight}</p>
            <p>Types: ${data.types.join(", ")}</p>
            <p>Stats:</p>
            <canvas id="stats"></canvas>
          `,
      });
      pokemonStats(data.stats);
    })
    .catch((error) => {
      swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Pokemon not found!",
      });
    });
}

function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  colorCard(card, data.types);

  card.innerHTML = `
          <img src="${data.image}" alt="${data.name}" />
          <h2>${data.name}</h2>
          <p>Number: ${data.id}</p>
          <p>Height: ${data.height}</p>
          <p>Weight: ${data.weight}</p>
          <p>Types: ${data.types.join(", ")}</p>
      `;
  document.querySelector(".container").appendChild(card);
}

function colorCard(card, types) {
  types = types.map((type) => type.toLowerCase());

  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  if (types.length === 2) {
    const color1 = typeColors[types[0]] || "white"; 
    const color2 = typeColors[types[1]] || "white"; 
    card.style.background = `linear-gradient(0.50turn, ${color1}, ${color2})`;
  } else {
    const color = typeColors[types[0]] || "white"; 
    card.style.background = color;
  }
}


document.addEventListener("DOMContentLoaded", function () {
  makeCard();
  document.getElementById("search").addEventListener("keyup", function (e) {
    if (e.target.matches("#search")) {
      var searchTerm = e.target.value.toLowerCase();
      document
        .querySelectorAll(".card h2") 
        .forEach((h2) => {
          var card = h2.closest(".card"); 
          var cardName = h2.textContent.toLowerCase();
          if (cardName.includes(searchTerm)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
    }
  });
  
  document.querySelector(".container").addEventListener("click", function (e) {
    let card = (e.target.closest(".card"));
    if (card) {
      showPokemonStats(card.querySelector("h2").textContent);
    }
  });
});

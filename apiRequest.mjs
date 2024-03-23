const url = 'https://pokeapi.co/api/v2/'

export async function getPokemon(name) {
    try {
        const response = await fetch(`${url}pokemon/${name}`)
        const data = await response.json()
        return {
            name: data.name,
            id: data.id,
            height: data.height,
            weight: data.weight,
            types: data.types.map(type => type.type.name),
            image: data.sprites.front_default,
            stats: data.stats.map(stat=>({base_stat: stat.base_stat}))
        }
    }
    catch (error) {
        console.error('Error:', error)
    }
}

export async function getPokemonList() {
    try {
        const response = await fetch(`${url}pokemon?limit=151`)
        const data = await response.json()
        return data.results.map(pokemon => pokemon.name)
    }
    catch (error) {
        console.error('Error:', error)
    }
}
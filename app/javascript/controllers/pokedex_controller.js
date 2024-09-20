import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "pokedexSection",
    "detailsSection",
    "nameSection",
    "typesSection",
    "pokedexEntry"
  ]

  connect() {
    console.log("Pokedex connected")
    this.getRandomPokemon()
    window.addEventListener("pokemonFetched", this.handlePokemonFetched.bind(this))
  }

  handlePokemonFetched(event) {
    const pokemon = event.detail.pokemon
    this.displayPokemon(pokemon)
  }

  getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1000) + 1
    this.getPokemon(randomId)
  }

  getPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((resp) => resp.json())
      .then((pokemon) => this.displayPokemon(pokemon))
  }

  displayPokemon(pokemon) {
    this.updatePokedex(pokemon)
    this.updateDetails(pokemon)
    this.updateName(pokemon)
    this.updateTypes(pokemon)
    this.updatePokedexEntry(pokemon)
  }

  updatePokedex(pokemon) {
    this.pokedexSectionTarget.innerHTML = `<img src="${pokemon.sprites.front_default}" id="sprite">`
  }

  updateDetails(pokemon) {
    this.detailsSectionTarget.innerHTML = `<p>HP: ${pokemon.stats[0].base_stat}</p>
      <p>Height: ${pokemon.height}, Weight: ${pokemon.weight} lbs</p>`
  }

  updateName(pokemon) {
    this.nameSectionTarget.innerHTML = `<h2>${pokemon.name}</h2>`
  }

  updateTypes(pokemon) {
    const typesList = pokemon.types
      .map((type) => `<li>${type.type.name}</li>`)
      .join("")
    this.typesSectionTarget.innerHTML = `<h3>Types:</h3><ul>${typesList}</ul>`
  }

  updatePokedexEntry(pokemon) {
    this.pokedexEntryTarget.innerHTML =
      '<button id="favorite-pokemon">Add to Team</button>'
  }
}

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "form"]

  connect() {
    console.log("Search controller connected!")
  }

  search(event) {
    event.preventDefault() // Prevent form from submitting
    const query = this.inputTarget.value.trim()

    if (query.length > 0 && !isNaN(query)) {
      this.fetchPokemon(Number(query))
    } else {
      alert("Please enter a valid Pokémon ID (number)!")
    }
  }

  fetchPokemon(query) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((resp) => resp.json())
      .then((pokemon) => {
        const event = new CustomEvent("pokemonFetched", { detail: { pokemon } })
        window.dispatchEvent(event) // Dispatch the event at the window level
      })
      .catch((error) => {
        alert("Error fetching Pokémon:", error)
      })
  }
}

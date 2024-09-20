import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["teamSlots", "teamSection"]

  connect() {
    this.currentTeam = []
    this.getTeam()
  }

  getTeam() {
    fetch(`http://localhost:3000/pokemon-team`)
      .then((resp) => resp.json())
      .then((team) => {
        this.currentTeam = team
        team.forEach((pokemon) => this.displayTeam(pokemon))
      })
  }

  displayTeam(pokemon) {
    const currentSlot = this.teamSlots.find(
      (slot) => Number(slot.id) === pokemon.position
    )
    currentSlot.textContent = ""

    const sprite = document.createElement("img")
    sprite.src = pokemon.sprite
    sprite.className = "team-sprite"

    const name = document.createElement("h3")
    name.textContent = pokemon.name

    const deleteButton = document.createElement("button")
    deleteButton.className = "remove-from-team"
    deleteButton.textContent = "X"
    deleteButton.addEventListener("click", (event) => this.handleDelete(event))

    currentSlot.appendChild(sprite)
    currentSlot.appendChild(name)
    currentSlot.appendChild(deleteButton)

    currentSlot.addEventListener("dragstart", (event) =>
      this.handleDragStart(event)
    )
    currentSlot.addEventListener("dragover", (event) =>
      this.handleDragOver(event)
    )
    currentSlot.addEventListener("drop", (event) => this.handleDrop(event))
  }

  handleDelete(event) {
    const pokemonSlot = event.target.parentElement
    const currentPokemon = this.currentTeam.find(
      (pokemon) => pokemonSlot.childNodes[1].textContent === pokemon.name
    )
    const id = currentPokemon.id

    fetch(`http://localhost:3000/pokemon-team/${id}`, { method: "DELETE" })
      .then((resp) => resp.json())
      .then((deletedPokemon) => {
        pokemonSlot.textContent = ""
        this.currentTeam = this.currentTeam.filter(
          (pokemon) => pokemon.id !== deletedPokemon.id
        )
        this.updateTeamOrder()
      })
  }

  updateTeamOrder() {
    this.currentTeam.forEach((pokemon) => {
      fetch(`http://localhost:3000/pokemon-team/${pokemon.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position: pokemon.position }),
      })
    })
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/html", event.target.id)
  }

  handleDrop(event) {
    const draggedSlotId = event.dataTransfer.getData("text/html")
    const draggedTeamSlot = document.getElementById(draggedSlotId)
    const targetTeamSlot = event.target

    if (targetTeamSlot.classList.contains("team-slots")) {
      this.swapTeamSlots(draggedTeamSlot, targetTeamSlot)
    }
  }

  swapTeamSlots(draggedSlot, targetSlot) {
    const draggedClone = draggedSlot.cloneNode(true)
    const targetClone = targetSlot.cloneNode(true)

    this.teamSectionTarget.replaceChild(targetClone, draggedSlot)
    this.teamSectionTarget.replaceChild(draggedClone, targetSlot)
  }
}

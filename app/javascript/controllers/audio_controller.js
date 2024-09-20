import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["audioPlayer"]

  connect() {
    console.log("Audio controller connected!")
  }

  play(event) {
    const cryObj = event.detail
    const audioPlayer = this.audioPlayerTarget

    audioPlayer.src = cryObj.legacy ? cryObj.legacy : cryObj.latest
    audioPlayer.play()
  }
}

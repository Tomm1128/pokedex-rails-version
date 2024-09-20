import { application } from "./controllers/application.js"
import TeamController from "./controllers/team_controller.js"
import PokedexController from "./controllers/pokedex_controller.js"
import AudioController from "./controllers/audio_controller.js"
import SearchController from "./controllers/search_controller.js"

application.register("team", TeamController)
application.register("pokedex", PokedexController)
application.register("audio", AudioController)
application.register("search", SearchController)

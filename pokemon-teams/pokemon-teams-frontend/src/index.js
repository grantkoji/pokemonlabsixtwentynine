const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', function(){
    const main = document.querySelector('main')
    fetchTrainers(TRAINERS_URL)

    function fetchTrainers(url) {
        fetch(url)
        .then(resp => resp.json())
        .then(data => {
            renderTrainers(data)})
        .catch(error => alert(error))
    }

    function renderTrainers(data) {
        data.forEach(trainer => {
            renderTrainer(trainer)
        })
    }

    function renderTrainer(trainer){
        const trainerDiv = document.createElement('div')
        trainerDiv.dataset.id = trainer.id
        trainerDiv.className = 'card'
        const trainerP = document.createElement('p')
        trainerP.textContent = trainer.name
        const trainerButton = document.createElement('button')
        trainerButton.textContent = 'Add Pokemon'
        trainerButton.dataset.trainerId = trainer.id
        const trainerUl = document.createElement('ul')

        trainer.pokemons.forEach(pokemon => {
            const liPokemon = document.createElement('li')
            liPokemon.innerHTML = `${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button>`
            trainerUl.appendChild(liPokemon)
        })
        
        trainerDiv.appendChild(trainerP)
        trainerDiv.appendChild(trainerButton)
        trainerDiv.appendChild(trainerUl)
        main.appendChild(trainerDiv)
    }


    main.addEventListener('click', function(e){
        if (e.target.textContent === 'Add Pokemon') {
            const addPokemonButton = e.target
            const thisTrainerDiv = addPokemonButton.parentNode
            if (countPokemon(thisTrainerDiv) >= 6) {
                alert("This Trainer already has a full Pokemon Team of 6. Cheater!")
            } else {
                postPokemon(POKEMONS_URL, thisTrainerDiv)   
            }
        } else if (e.target.className === 'release') {
            const deleteButton = e.target
            deletePokemon(`${POKEMONS_URL}/${deleteButton.dataset.pokemonId}`)

        }

    })


    function deletePokemon(url) {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
            })
        })
        .then(resp => resp.json())
        .then(data => removeLiFromTrainer(data))
        .catch(error => alert(error))

    }

  
    function countPokemon(trainerDiv) {
        return trainerDiv.querySelectorAll('li').length
    }

    function postPokemon(pokemonUrl, trainerDiv) {
        fetch(pokemonUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "trainer_id": trainerDiv.dataset.id
            })
        })
        .then(resp => resp.json())
        .then(data => updateTrainer(data, trainerDiv))
        .catch(error => alert(error))
    }

    function removeLiFromTrainer(data) {
        const liToDelete = document.querySelector(`[data-pokemon-id="${data.id}"]`)
        liToDelete.closest('li').remove()
    }

    function updateTrainer(pokemon, TrainerDiv){
        const trainerUl = TrainerDiv.querySelector('ul')
        const liPokemon = document.createElement('li')
        liPokemon.innerHTML = `${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button>`
        trainerUl.appendChild(liPokemon)

    }


})
let store = {
    user: { name: "Student" },
    selectedRover: '',
    data: '',
    rovers: ['Spirit', 'Opportunity', 'Curiosity'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    console.log('Store updated')
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    return `
        <header><h1>Mars Rover Dashboard</h1></header>
        <main>
            <section>
                ${RoverData(state)}
            </section>
        </main>
        <footer>
            <h3>A project for Udacity's Intermediate JavaScript Nanodegree</h3>
        </footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const RoverData = (state) => {

    if (!state.selectedRover) {
        return (`
            <div class="rover-container">
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[0]}'})" tabindex="0">
                    <h2>${state.rovers[0]}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[1]}'})" tabindex="0">
                    <h2>${state.rovers[1]}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[2]}'})" tabindex="0">
                    <h2>${state.rovers[2]}</h2>
                </div>
            </div >
        `)
    }

    if (!state.data) {
        console.log(`Getting API data for ${state.selectedRover}`)
        getRoverData(state)
        return ""
    }

    console.log('Data: ', state.data)
    return (`
        <p>${state.data.results.photos[0].rover.name}</p>
        <button onclick="updateStore(store, {selectedRover: '', data: ''})">
            Back
        </button>
    `)
}



// ------------------------------------------------------  API CALLS

const getRoverData = (state) => {
    const { selectedRover } = state

    fetch(`http://localhost:3000/${selectedRover}`)
        .then(res => res.json())
        .then(data => updateStore(state, { data }))
}

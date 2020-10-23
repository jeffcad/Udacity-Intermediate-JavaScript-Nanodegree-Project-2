let store = {
    selectedRover: '',
    data: '',
    rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity']),
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
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers.get(0)}'})" tabindex="0">
                    <h2>${state.rovers.get(0)}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers.get(1)}'})" tabindex="0">
                    <h2>${state.rovers.get(1)}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers.get(2)}'})" tabindex="0">
                    <h2>${state.rovers.get(2)}</h2>
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
    const { latest_photos } = state.data.results
    const photoURL = latest_photos.map(photo => photo.img_src)
    const photoDate = state.data.results.latest_photos[0].earth_date
    const { name, launch_date, landing_date, status } =
        state.data.results.latest_photos[0].rover

    return (`
        <p>Rover name: ${name}</p>
        <p>Launched from Earth on: ${launch_date}</p>
        <p>Landed on Mars on: ${landing_date}</p>
        <p>Mission status: ${status}</p>
        <p>Photos taken on Mars on Earth date: ${photoDate}
        <button onclick="updateStore(store, {selectedRover: '', data: ''})">
            Back
        </button>
        <div class="photo-container">
            ${photoURL.map(url => `<img class="photo" src="${url}" alt="Photo taken on Mars by ${name}"/>`).join('')}
        </div>
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

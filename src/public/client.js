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
            ${wrapInDivFunction('rover-container', joinMapperFunction,
            store.rovers, roverCardMakerFunction)}
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
        <button onclick="updateStore(store, {selectedRover: '', data: ''})" class="back-button">Back</button>
        ${wrapInDivFunction('photo-container', joinMapperFunction,
        photoURL, photoElementMakerFunction)}
        <button onclick="updateStore(store, {selectedRover: '', data: ''})" class="back-button">Back</button>
    `)
}

// --------------- COMPONENT HELPER FUNCTIONS, INCLUDING HIGHER-ORDER FUNCTIONS

const photoElementMakerFunction = (url) => {
    return (`
    <img class="photo" src="${url}" alt="Photo taken on Mars by 
    ${store.selectedRover}"/>
    `)
}

const roverCardMakerFunction = (rover) => {
    return (`
    <button class="rover-card"
    onclick="updateStore(store, {selectedRover: '${rover}'})">
    <h2 class="card-title">${rover}</h2>
    </button>
    `)
}

const joinMapperFunction = (mapThis, elementMakerFunction) => {
    return (`
        ${mapThis.map(x => elementMakerFunction(x)).join('')}
    `)
}

const wrapInDivFunction = (divClass, mapperFunction, mapThis, elementMakerFunction) => {
    return (`
    <div class="${divClass}">
        ${mapperFunction(mapThis, elementMakerFunction)}
    </div >
    `)
}

// ------------------------------------------------------  API CALLS

const getRoverData = (state) => {
    const { selectedRover } = state

    fetch(`http://localhost:3000/${selectedRover}`)
        .then(res => res.json())
        .then(data => updateStore(state, { data }))
}

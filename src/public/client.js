// Main data storage object, uses Immutable for the rover list
let store = {
    selectedRover: '',
    data: '',
    rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity']),
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
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

    // If no rover is selected in store, create the rover card HTML with 
    // wrapInDivFunction and return
    if (!state.selectedRover) {
        return (`
            ${wrapInDivFunction('rover-container', joinMapperFunction,
            store.rovers, roverCardMakerFunction)}
        `)
    }

    // If a rover is selected but there's no data yet, call the API with
    // getRoverData and return
    // getRoverData will call the updateStore function, which calls this
    // function again, so returning immediately after prevents errors in
    // console with undefined data
    if (!state.data) {
        getRoverData(state)
        return ""
    }

    // Array of photos from the rover
    const { photos } = state.data.results

    // Map the photo array to get the URLs of the photos
    const photoURL = photos.map(photo => photo.img_src)

    // All photos will be from the same date, so use photo[0]
    const photoDate = state.data.results.photos[0].earth_date

    // Get the required mission data
    const { name, launch_date, landing_date, status } =
        state.data.results.photos[0].rover

    // Makes the information HTML and calls wrapInDivFunction to start the
    // production of the photo array
    return (`
        <ul class="info-container">
            <li>Rover name: ${name}</li>
            <li>Launched from Earth on: ${launch_date}</li>
            <li>Landed on Mars on: ${landing_date}</li>
            <li>Mission status: ${status}</li>
            <li>Photos taken on: ${photoDate}</li>
        </ul>
        <button onclick="updateStore(store, {selectedRover: '', data: ''})" class="back-button">Back</button>
        ${wrapInDivFunction('photo-container', joinMapperFunction,
        photoURL, photoElementMakerFunction)}
        <button onclick="updateStore(store, {selectedRover: '', data: ''})" class="back-button">Back</button>
    `)
}

// --------------- COMPONENT HELPER FUNCTIONS, INCLUDING HIGHER-ORDER FUNCTIONS

/**
 * @description Higher-order function to wrap elements of mapped array in <div>
 * In this project it is used to make containers for the rover cards and photos
 * @param {string} divClass Name of the class that will be assigned to the <div>
 * @param {function} mapperFunction Function that will do the mapping
 * @param {Array} mapThis The array that will be mapped
 * @param {function} elementMakerFunction Function to create the element HTML
 */
const wrapInDivFunction = (divClass, mapperFunction, mapThis, elementMakerFunction) => {
    return (`
    <div class="${divClass}">
        ${mapperFunction(mapThis, elementMakerFunction)}
    </div >
    `)
}

/**
 * @description Higher-order function to make a joined map
 * In this project it is used to make arrays of rover cards and photos and join
 * @param {Array} mapThis The array to be mapped and joined
 * @param {function} elementMakerFunction Function to use for mapping
 */
const joinMapperFunction = (mapThis, elementMakerFunction) => {
    return (`
        ${mapThis.map(x => elementMakerFunction(x)).join('')}
    `)
}

/**
 * @description Makes button HTML for a rover card on main UI
 * @param {string} rover Name of the rover
 * @returns Button HTML
 */
const roverCardMakerFunction = (rover) => {
    return (`
    <button class="rover-card"
    onclick="updateStore(store, {selectedRover: '${rover}'})">
    <h2 class="card-title">${rover}</h2>
    </button>
    `)
}

/**
 * @description Makes image tag HTML for a photo URL
 * @param {string} url URL of the photo
 * @returns Image tag HTML
 */
const photoElementMakerFunction = (url) => {
    return (`
    <img class="photo" src="${url}" alt="Photo taken on Mars by 
    ${store.selectedRover}"/>
    `)
}

// ------------------------------------------------------  API CALLS

const getRoverData = (state) => {
    const { selectedRover } = state

    fetch(`http://localhost:3000/${selectedRover}`)
        .then(res => res.json())
        .then(data => updateStore(state, { data }))
}

let store = {
    user: { name: "Student" },
    apod: '',
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
    // let { apod } = state

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

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

// If image does not already exist, or it is not from today -- request it again
// const today = new Date()
// const photodate = new Date(apod.date)
// console.log(photodate.getDate(), today.getDate());

// console.log(photodate.getDate() === today.getDate());
// if (!apod || apod.date === today.getDate()) {
//     getImageOfTheDay(store)
// }

// check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }

const RoverData = (state) => {

    if (!state.selectedRover) {
        return (`
            <div class="rover-container">
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[0]}'})">
                    <h2>${state.rovers[0]}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[1]}'})">
                    <h2>${state.rovers[1]}</h2>
                </div>
                <div class="rover-card" onclick="updateStore(store, {selectedRover: '${store.rovers[2]}'})">
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
        <p>${store.data.results.photos[0].rover.name}</p>
        <button onclick="updateStore(store, {selectedRover: ''})">
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

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.listen(port, () => console.log(`Mars Rover Dashboard app listening on port ${port}!`))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API call

app.get('/:name', async (req, res) => {
    const name = req.params.name.toLowerCase()

    let date
    if (name === 'spirit') {
        date = '2010-02-01'
    } else if (name === 'opportunity') {
        date = '2018-06-04'
    } else if (name === 'curiosity') {
        const d = new Date()
        date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() - 1}`
    } else {
        res.send('Invalid address. Choose /opportunity, /spirit or /curiosity')
        return
    }

    try {
        const results = await fetch(`
            https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}
        `)
            .then(res => res.json())
        res.send({ results })
    } catch (err) {
        console.log('error:', err);
    }
})

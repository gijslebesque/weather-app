// Require modules
const express 	= require('express')
const dotenv	= require('dotenv').load()
const app 		= express()

// Require our modules
const scraper 	= require(__dirname + '/modules/scraper')
const db 		= require(__dirname + '/modules/database')

// Set view engine to pug
app.set('view engine', 'pug')
app.set('views', __dirname+'/views')

// Set static views
app.use(express.static(__dirname+'/static'))


// Index route
app.get('/', (req, res) => {
	// Get latest prediction results from database (= today's results)
	db.Preditions.findAll({
		limit: 1,							// find only one database entry
		order: [ ['createdAt', 'DESC'] ] 	// make sure it is the last added entry
	}).then( (result) => {
		console.log('Data hieronder wordt naar front end gestuurd.')
		console.log(result)
		// Render index with these result
		res.render('index', {result: result})
	})
})

// Run scraper once every 24 hours
// setInterval( () => {
	scraper.scrape()
// }, 8640000) // 100x60x60x26 milliseconds equals 24 hours.

// app listens on localhost 8000
app.listen(8000, () => {
	console.log('Server listening...')
})
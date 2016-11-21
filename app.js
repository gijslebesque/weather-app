// Require modules
const express 	= require('express')
const dotenv	= require('dotenv').load()
const app 		= express()

// Require our modules
const scraper 	= require(__dirname + '/modules/scraper')

// Set view engine to pug
app.set('view engine', 'pug')
app.set('views', __dirname+'/views')

// Set static views
app.use(express.static(__dirname+'/static'))


// Index route
app.get('/', (req, res) => {
	res.render('index')

})

// Set timeout so server can start up first
setTimeout( () => {
	scraper.scrape()
}, 3000 )

// app listens on localhost 8000
app.listen(8000, () => {
	console.log('Server listening...')
})
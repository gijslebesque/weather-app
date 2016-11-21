const express 	= require('express')
const dotenv	= require('dotenv').load()
const app 		= express()

// Set view engine to pug
app.set('view engine', 'pug')
app.set('views', __dirname+'/../views')

// Set static views
app.use(express.static(__dirname+'/../static'))


app.get('/', (req, res) => {
	res.send('hello world')
})

app.listen(8000, () => {
	console.log('Server listening...')
})
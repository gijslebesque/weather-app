// Require module
const scraperjs = require('scraperjs')
const db 		= require(__dirname + '/database')

function scrape() {
	// Set timeout so server can start up first
	setTimeout( () => {
		getData()
	}, 3000 )
}

// Function to scrape the weather data for today and tommorow
function getData() {
	// Initiate scraper
	scraperjs.StaticScraper
		// Set website to be scraped
		.create('http://www.pietsweer.nl/')
		// Scrape given tags/classes from the page
		.scrape( ($) => {
			return $('.b-weather__link--days')
			.get()
		})
		// Do something with the scraped content
		.then((content) =>{
			// Create an array to store the data
			let data = []
			// Content is an array so loop over the found elements
			for (let i = 0; i < content.length; i++) {
				// Find the part of the site that contains the data for today OR tommorow
				if (content[i].attribs.href === '#/eu/nl/1/day/' || content[i].attribs.href === '#/eu/nl/0/') {
					// Create an object to store the data for one day
					let weatherData = {}
					// Loop over the elements within this part
					for (let j = 0; j < content[i].children.length; j++) {
						let data = content[i].children[j]
						// Skip over all empty elements
						if (data.attribs !== undefined) {
							// Get the weather title ('Vandaag', 'Morgen', etc)
							if (data.attribs.class === 'weather-title') {
								weatherData.title = data.children[0].data
							}
							// Find the part containing the tempratures (is split into two span elements)
							if (data.attribs.class === 'weather-temp') {
								// Removen on numeric characters (degree celcius sign)
								let tempDay = data.children[0].next.children[0].data.replace(/\D/g,'')
								let tempNight = data.children[0].next.next.next.children[0].data.replace(/\D/g,'')
								weatherData.tempDay = tempDay
								weatherData.tempNight = tempNight
							}
							// Get the data about wind. Split into direction and speed
							if (data.attribs.class === 'weather-wind') {
								let windData = data.children[0].data.split(' ')
								weatherData.windDirection = windData[0]
								weatherData.windSpeed = windData[1]
							}
							// Get the weather icon name (icon conveys info such as sunny or rain)
							if (data.attribs.class.includes('icon')) {
								weatherData.iconName = data.attribs.class
							}
						}
					}
					data.push(weatherData)
				}
			}
			// Call the function to store all data into the database
			storeData(data)
		})
}

// Store given data into database
function storeData(data) {
	// Get the current date and format it into dd-mm-yyyy
	let currentDate = dateFormat(new Date())
	console.log(data)
	// Store data into database
	db.Weather.create({
		forecast_date:				currentDate,
		forecast_temp_day: 			data[1].tempDay,
		forecast_temp_night: 		data[1].tempNight,
		forecast_icon_name: 		data[1].iconName,
		forecast_wind_direction: 	data[1].windDirection,
		forecast_wind_speed: 		data[1].windSpeed,
		current_temp_day: 			data[0].tempDay,
		current_temp_night: 		data[0].tempNight,
		current_icon_name: 			data[0].iconName,
		current_wind_direction: 	data[0].windDirection,
		current_wind_speed: 		data[0].windSpeed
	})

	console.log('scraper done')
}

// Helper function to reformat the date
function dateFormat (date) {
	let year 	= date.getFullYear()
	let month 	= ('0' + (date.getMonth()+1)).slice(-2)
	let day 	= ('0' + date.getDate()).slice(-2)
	return day+'-'+month+'-'+year
}

module.exports = {
	scrape: scrape
}
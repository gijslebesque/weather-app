// Require module
const scraperjs = require('scraperjs')
const db 		= require(__dirname + '/database')

function scrape() {
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
			// Create an object to store the data
			let weatherData = {}
			// Content is an array so loop over the found elements
			for (let i = 0; i < content.length; i++) {
				// Find the part of the site that contains tomorrow forecast
				if (content[i].attribs.href === '#/eu/nl/1/day/') {
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
				}
			}
			storeData(weatherData)
	})
}

function storeData(data) {
	// Get the current date and format it into dd-mm-yyyy
	let currentDate = dateFormat(new Date())

	// Store data into database
	db.Weather.create({
		forecast_date:				currentDate,
		forecast_temp_day: 			data.tempDay,
		forecast_temp_night: 		data.tempNight,
		forecast_icon_name: 		data.iconName,
		forecast_wind_direction: 	data.windDirection,
		forecast_wind_speed: 		data.windSpeed
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
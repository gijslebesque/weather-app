
//require db
const db = require(__dirname + '/database')

//declare function that will compare and save data in new table
let compare = () =>{
	//empty object for storing data
	let resultComparisions = {}
	//fing scraped data in tabel weather.
	db.Weather.findAll({
		// find function will only find the scraped data of today and yesterday
		limit: 2,
		// order of the array in which results will be stored
		order: [ ['createdAt', 'DESC']]
		//start comparing the predicted data of yesterday with weather of today
		}).then( result => {
			//set date of current day
			resultComparisions.date = result[0].forecast_date
			// compare yesterday's predicted day temperature with the actual day temperature
		if(result[1].forecast_temp_day == result[0].current_temp_day){
			resultComparisions.prediction_temp_day = true
		}
		else{
			resultComparisions.prediction_temp_day = false
		}
		// compare yesterday's predicted night temperature with the actual night temperature
		if(result[1].forecast_temp_night == result[0].current_temp_night){
			resultComparisions.prediction_temp_night = true
		}
		else{
			resultComparisions.prediction_temp_night = false
		}
		// compare yesterday's predicted wind direction temperature with the actual wind direction 
		if(result[1].forecast_wind_direction == result[0].current_wind_direction){
			resultComparisions.prediction_wind_direction = true
		}
		else{
			resultComparisions.prediction_wind_direction = false
		}
		// compare yesterday's predicted wind speed with the actual wind speed
		if(result[1].forecast_wind_speed == result[0].forecast_wind_speed){
			resultComparisions.prediction_speed = true
		}
		else{
			resultComparisions.prediction_speed = false
		}

		//insert data into table called prediction
	}).then( ()=> {
		db.Compare.create({
			date: resultComparisions.date,
			compare_temp_day: resultComparisions.prediction_temp_day,
			compare_temp_night: resultComparisions.prediction_temp_night,
			compare_wind_direction: resultComparisions.prediction_wind_direction,
			compare_wind_speed: resultComparisions.prediction_speed
		})
	})
}
//export module
module.exports = {compare: compare}

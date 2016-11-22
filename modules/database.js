const sequelize 	= require('sequelize')

let db = {}

db.conn = new sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	server: 	process.env.DB_SERVER,
	dialect: 	process.env.DB_DIALECT
})

db.Weather = db.conn.define('weather', {
	forecast_date: 				sequelize.STRING,
	forecast_temp_day: 			sequelize.INTEGER,
	forecast_temp_night: 		sequelize.INTEGER,
	forecast_icon_name: 		sequelize.STRING,
	forecast_wind_direction: 	sequelize.STRING,
	forecast_wind_speed: 		sequelize.STRING,
	current_temp_day: 			sequelize.INTEGER,
	current_temp_night: 		sequelize.INTEGER,
	current_icon_name: 			sequelize.STRING,
	current_wind_direction: 	sequelize.STRING,
	current_wind_speed: 		sequelize.STRING
})

db.Prediction = db.conn.define('prediction', {
	date: 						sequelize.STRING,
	prediction_temp_day: 		sequelize.BOOLEAN,
	prediction_temp_night: 		sequelize.BOOLEAN,
	prediction_wind_direction: 	sequelize.BOOLEAN,
	prediction_speed: 			sequelize.BOOLEAN
})


let predict = () =>{
	let resultComparisions = {}
	db.Weather.findAll({
		limit: 2,
		order: [ ['createdAt', 'DESC']]
		}).then( result => {
			console.log(result[1].dataValues)
			console.log(result[0].dataValues)
			resultComparisions.date = result[0].forecast_date
		if(result[1].forecast_temp_day == result[0].current_temp_day){
			resultComparisions.prediction_temp_day = true
		}
		else{
			resultComparisions.prediction_temp_day = false
		}
		if(result[1].forecast_temp_night == result[0].current_temp_night){
			resultComparisions.prediction_temp_night = true
		}
		else{
			resultComparisions.prediction_temp_night = false
		}
		if(result[1].forecast_wind_direction == result[0].current_wind_direction){
			resultComparisions.prediction_wind_direction = true
		}
		else{
			resultComparisions.prediction_wind_direction = false
		}
		if(result[1].forecast_wind_speed == result[0].forecast_wind_speed){
			resultComparisions.prediction_speed = true
		}
		else{
			resultComparisions.prediction_speed = false
		}

	}).then( ()=> {
		console.log(resultComparisions)
		db.Prediction.create({
			date: resultComparisions.date,
			prediction_temp_day: resultComparisions.prediction_temp_day,
			prediction_temp_night: resultComparisions.prediction_temp_night,
			prediction_wind_direction: resultComparisions.prediction_wind_direction,
			prediction_speed: resultComparisions.prediction_speed
		})
	})
}

predict()


db.conn.sync().then( ()=>{
	console.log('Database sync successful')
}, (err) => {
	console.log('Database sync failed: ' + err)
} )

module.exports = db


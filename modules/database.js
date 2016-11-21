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

db.conn.sync().then( ()=>{
	console.log('Database sync successful')
}, (err) => {
	console.log('Database sync failed: ' + err)
} )

module.exports = db


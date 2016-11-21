const scraperjs = require('scraperjs')

scraperjs.StaticScraper.create('http://www.pietsweer.nl/')
    .scrape(($) => {
        return $(".b-weather__list-item--days").map(() => {
            return $(this).text()
        }).get()
    })
    .then((news) =>{
        console.log(news)
})

 module.exports = scraperjs
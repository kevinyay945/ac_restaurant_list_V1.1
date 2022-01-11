const mongoose = require('mongoose')
const restaurantModel = require('../restaurantModel') // 載入 restaurantModel
//載入restaurant.json
const restaurantListJson = require('../restaurant.json')
let restaurantList = forHandlebasIf(restaurantListJson)


mongoose.connect('mongodb://localhost/restaurant_test')
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (element of restaurantList) {
    restaurantModel.create({
      id: element['id'],
      name: element['name'],
      name_en: element['name_en'],
      category: element['category'],
      image: element['image'],
      location: element['location'],
      phone: element['phone'],
      google_map: element['google_map'],
      rating: element['rating'],
      description: element['description'],
      sameName: element['sameName']
    })
  }
  console.log('done')
})

function forHandlebasIf(array) {//先對資料進行處理，增加sameName作為key，名稱和英文名稱(name and name_en)完全相同value為false，不同為true
  let list = array.results

  for (let index = 0; index < list.length; index++) {

    if (list[index].name === list[index].name_en) {
      list[index].sameName = false
    } else {
      list[index].sameName = true
    }
  }
  return list
}
//設定express環境
const express = require('express')
const app = express()
const port = 3000

//載入handlebars
const exhdbs = require('express-handlebars')

const handlebars = exhdbs.create({
})

//載入mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant_test')

//載入restaurantModel
const restaurantModel = require('./models/restaurantModel')


//載入modules，使用自製模組
const modules = require('./models/modules')

//設定使用handlebars
//express-handlebars ^5到^6的改動
app.engine('.handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.set('views', './views');


//使用public設定
app.use(express.static('public'))
//表單資料處理
app.use(express.urlencoded({ extended: true }))
//get取得頁面
app.get('/', (req, res) => {
  restaurantModel.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurantList }))
    .catch(error => console.error(error))
})
//顯示餐廳詳細資料
app.get('/restaurants/detail/:id', (req, res) => {
  const id = req.params.id
  return restaurantModel.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

//修改頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurantModel.findById(id)
    .lean()
    .then(restaurant => res.render('editrestaurant', { restaurant }))
    .catch(error => console.error(error))
})

app.post('/restaurants/edit/:id', (req, res) => {
  const restaurant = req.params.id
  const body = (req.body)
  let newBody = modules.bodyDataEdit(body)
  restaurantModel.findByIdAndUpdate(restaurant, newBody)
    .then(() => res.redirect(`/restaurants/detail/${restaurant}`))
    .catch(error => console.log(error))
})

//刪除功能
app.post('/restaurants/delete/:id', (req, res) => {
  const id = req.params.id
  return restaurantModel.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//搜索功能
app.get('/search', (req, res) => {
  const keyword = modules.removeBlank(req.query.keyword).toLowerCase()
  const reg = new RegExp(keyword, 'i')

  restaurantModel.find({ $or: [{ name: reg }, { name_en: reg }, { category: reg }] })
    .lean()
    .then(restaurantList => restaurantList.length === 0
      ? res.render('nonsearchResult')
      : res.render('index', { restaurantList }))
    .catch(error => console.log('error:' + error))
})


//設定port
app.listen(port, () => {
  console.log(`localhost:${port}`)
})
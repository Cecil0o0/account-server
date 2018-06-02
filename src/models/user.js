const vastify = require('vastify')
const vast = vastify.getInstance()
const mongoose = vast.db
let UserModel = mongoose.model('UserModel', {
  id: Number,
  name: String
}, 'UserModel')

UserModel.find({
  name: '路人甲'
}, {}, (err, arr) => {
  if (err) return console.log(err)
  if (arr.length === 0) {
    Array.from(['路人甲', '群演乙', '躺尸丙']).forEach((v, i) => {
      const userInstance = new UserModel({
        id: i,
        name: v
      })
      userInstance.save().then(() => {
        console.log('save success')
      })
    })
  }
})

module.exports = UserModel
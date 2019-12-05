const mongodb = require('mongodb')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//uncomment me and add password
const pass = require('../pw.js');

console.log(pass);


// const generatedItems = require('./dbGenerator.js') //UNCOMMENT THIS FOR GENERATING A NEW DB

mongoose.connect(`mongodb+srv://gammazonReview:${pass}@gammazonreviews-iixhb.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });

var connection = mongoose.connection;

var reviewSchema = new Schema({
  id: {type: Number, unique: true},
  name: String,
  link: Schema.Types.Mixed,
  price: Number,
  comments: Array,
  average: Number,
  individualRatings: Array
})
var reviewModel = mongoose.model('reviewModel', reviewSchema, 'Reviews');

connection.on('error', () => {
  console.log('crashed');
});
connection.once('open', function () {
  console.log('connected')
});


const fetchAllComments = async function() {
  var queryPromise = new Promise((resolve, reject) => {
    reviewModel.find({}, (err, result) => {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
  return queryPromise;
}


//UNCOMMENT THE BELOW LINE TO GENERATE A NEW DB... WILL REQUIRE THE GENERATED ITEMS IMPORT TO WORK.

// reviewModel.collection.insert(generatedItems, function (err, docs) {
//   if (err) {
//     return console.error(err);
//   } else {
//     console.log("Multiple documents inserted to Collection");
//   }
// });


//needs to be updated to also display updated averages
const updateReviewCount = (name, id) => {
  var updatePromise = new Promise((resolve, reject) => {
    reviewModel.collection.update({name: `${name}`}, { $inc: {[`comments.${id}.helpfulCount`]: 1} }, (err, result) => {
      if(err) {
        reject(err);
      } else {
        resolve(result);
      }
    } )
  })

  return updatePromise;
}





module.exports.connection = connection;
module.exports.fetchAllComments = fetchAllComments;
module.exports.updateReviewCount = updateReviewCount;
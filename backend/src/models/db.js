const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://bloguser:blogpass1@ds033187.mlab.com:33187/mblog');

module.exports = mongoose;

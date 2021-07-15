const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const procutSchema = new mongoose.Schema({
name: {
    type: String,
    unique: true,
    required: true
  },
  imageurl:{
    type:String,
    required:true
  },
  description:{type:String}
}, { timestamps : true});

module.exports = mongoose.model('Product', procutSchema);
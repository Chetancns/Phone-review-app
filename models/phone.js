const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const PhoneSchema = new Schema({
  name:{
    type:String,
    required: true
  },
  brand:{
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  camera: {
    type: String,
    required: true
  },
  battery: {
    type: String,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  review: [{
    reviewBody: {
      type: String,
      required: true
    },
    reviewDate:{
      type: Date,
      default: Date.now
    },
    reviewUser:{
      type: Schema.Types.ObjectId,
      ref:'users'
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('phone', PhoneSchema,'phone');
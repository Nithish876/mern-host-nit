const mongoose = require('mongoose')

const connectdb =async ()=>{ 
  await mongoose.connect('mongodb+srv://Nithish:Nithish876@cluster0.pauatjb.mongodb.net/?retryWrites=true&w=majority')
  console.log('connected to the database');
}

module.exports = connectdb


const mongoose = require('mongoose')

const Blogschema = new mongoose.Schema({
    img:{
        type:String, 
    }
    ,author:{
        type:String,
        required:true
    }, 
    title:{
        type:String,
        required:true
    },
    para:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const blogmodel = mongoose.model('blogs',Blogschema)

module.exports = blogmodel
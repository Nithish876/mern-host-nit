const express = require('express')
const connectdb = require('./database/connection')
const path = require('path')
const bcrypt = require('bcryptjs')
const {ObjectId} = require('mongodb')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const bdp = require('body-parser') 
const Usermodel = require('./database/schema/Userschema')
const blogmodel = require('./database/schema/Blogschema')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
const salt = bcrypt.genSaltSync(10)
app.use(express.json())
app.use(cors())  
 
app.post('/login',async(req,res)=>{
    const {username,password} = req.body; 
    const existuser = await Usermodel.findOne({username:username})
    console.log(existuser);
    if(!existuser){
        return res.status(404).json('user not found i database try register!')
    }
    const passok = bcrypt.compareSync(password,existuser.password)
    if(passok){
        //logged in
        return res.status(200).json({msg:'ok',user:existuser.username})
    }else{
        return res.status(200).json({msg:"failed"})
    }
})
app.post('/register',async(req,res)=>{ 
    const {username,password} = req.body; 
    const existuser = await Usermodel.findOne({username:username})
    if(existuser){ 
       return res.status(200).json({msg:"exist"});
    } else{

        const userdoc = {
            username,password:bcrypt.hashSync(password,salt)
        }
        await Usermodel.create(userdoc)
        return res.status(201).json(userdoc)
    }
})



app.get('/blogs',async(req,res)=>{
     try { 
        const allblogs = await blogmodel.find()
       return res.status(200).json(allblogs)
     } catch (error) {
      return res.status(400).json("something went wrong plz try again later")  
     }
})

app.delete('/blogs/:id',async (req,res)=>{
    const {id} = req.params
      try {
        await blogmodel.findByIdAndDelete(id)
        return res.status(200).json('blog deleted successfully')
      } catch (error) {
        console.log(error);
      }
})
app.get('/blogs/:id',async(req,res)=>{
   
  await blogmodel.findById(req.params.id)
  .then(userfound=>{
    if(!userfound){return res.status(404).json("blog not found")}
    return res.status(200).json(userfound)
  })
  .catch(err=>console.log(
    err
  ))
})
app.put('/blogs/:id',async (req,res)=>{
    const {id} = req.params
    const data = req.body
    try {
       const editedblog =  await blogmodel.findByIdAndUpdate(id,data)
        return res.status(200).json({msg:'blog edited succesfully',editedblog})
    } catch (error) {
        console.log(error);
    }
})
app.post('/createblog',async(req,res)=>{
    const {img,title,paragraph,author}= req.body
    console.log(req.body)
    const blog = {
        img,title,para:paragraph,author
    }
    try {
        
    await blogmodel.create(blog)
    return res.status(201).json("Blog Created Succesfully")
    } catch (error) {
        console.log(error);
        return res.status(200).json({msg:"failed"})
       
    }
})
app.use(express.static(path.join(__dirname,'../client/build')))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})
const PORT = process.env.API_PORT
connectdb().then(() => {
    app.listen(PORT,()=>{
        console.log('server is runnin gon the port '+PORT);
    })
})






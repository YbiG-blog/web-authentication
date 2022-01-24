//jshint esversion:6
require('dotenv').config()
// here  we use dotenv package for secure our secret key and dotenv=means a environment-variable to store details as like secret ker

const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// encryption use to encode the data


const app=express();

console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
email : String,
password : String
});
// const secret = "thisismysecretcredentials."
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){

    const newuser = new User({
        email : req.body.username,
password : req.body.password
    });
    newuser.save(function(err)
    {if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
      const  username = req.body.username;
const password = req.body.password;
    User.findOne({email: username},function(err,founduser){
if(err)
{
    console.log(err);
}
else
{if(founduser){
    if(founduser.password==password)
    {
        res.render("secrets");
    }
    else{
        res.send("password is wrong");
    }
}
}

    });
});


app.listen(3000,function(){
    console.log("server is running on port 3000");
})

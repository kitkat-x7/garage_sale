const express=require('express');
const app = express();
app.use(express.json());

class email{
    constructor(req){
        this.email=req.body.email;
    }
    check_email(){
        if(!this.email){
            
            return {
                "valid":false,
                "status":404,
                "message":"Email is required."
            };
        }
        if(!this.email.includes("@") || !this.email.includes(".com")){
            return {
                "valid":false,
                "status":400,
                "message":"incorrect email address",
            };
        }return {
            valid:true,
            status:200,
            message:"OK"
        }
    }
}

class password{
    constructor(req){
        this.password=req.body.password;
    }
    check_password(){
        if(!this.password){

            return {
                "valid":false,
                "status":404,
                "message":"Password is required."
            };
        }
        if(this.password.length<8){
            return {
                "valid":false,
                "status":400,
                "message":"Weak password",
            };
        }
        if(!(/\d/.test(this.password)) || !(/[a-zA-Z]/.test(this.password)) || !(/[^a-zA-Z0-9]/.test(this.password))){
            return {
                "valid":false,
                "status":400,
                "message":"Weak password",
            };
        }
        return {
            valid:true,
            status:200,
            "message":"OK",
        }
    }
}

class details{
    constructor(req){
        this.firstname=req.body.firstname;
        this.lastname=req.body.lastname;
        this.address=req.body.address;
        this.phone_number=req.body.phone_number;
    }
    check_details(){
        if(!(/\d/.test(this.phone_number))){
            return {
                "valid":false,
                "status":400,
                "message":"Valid Phone Number is required."
            };
        }
        return {
            valid:true,
            status:200,
            "message":"OK"
        }
    }
}

module.exports={
    email,
    password,
    details,
}
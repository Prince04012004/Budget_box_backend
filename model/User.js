import mongoose from 'mongoose';
const categoryschema={
    "food":{
        type:Number
    },
   "travelling":{
    type:Number
   },
   "others":{
    type:Number
   }
   
}
const debtschema={
    "food":{
        type:Number,
        default:0
    },
    "travelling":{
        type:Number,
        default:0
    },
    "others":{
        type:Number,
        default:0
    }
}

const userSchema= new mongoose.Schema({
    "name":{
        type:String,
        required:true

    },
    "email":{
        type:String,
        required:true,
        unique:true
    },
    "password":{
        type:String,
        required:true
        
    },
    "monthlyincome":{
        type:Number,
        required:true
    },
    "dailybudget":{
        type:categoryschema,
        required:true
    },
    "budgetOver":{
        type:debtschema,
        default:{}
    },
    "selectedtune":{
        type:String,
        enum:["alert1","alert2"], // for alarm
        default:"alert1"
    },
    "role":{
        type:String,
        enum:["user","admin"],
        default:"user"

    }
},{
    timestamps:true
}
)
export default mongoose.model('User',userSchema);

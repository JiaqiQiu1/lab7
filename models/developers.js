let mongoose = require("mongoose");
let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String
        }
    },
    level:{
        type: String,
        validate:{
            validator: function(level){
                return level === "BEGINNER" || level === "EXPERT";
            }
        },
        required: true
    },
    address:{
        state:{
            type:String
        },
        suburb:{
            type: String
        },
        street:{
            type:String
        },
        unit:{
            type:String
        }
    }
});

module.exports = mongoose.model('Developers', developerSchema);

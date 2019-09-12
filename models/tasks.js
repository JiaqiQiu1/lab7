let mongoose = require("mongoose");
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developers"
    },
    dueDate:{
        type: Date
    },
    status:{
        type: String,
        validate:{
            validator: function(status){
                return status === "InProgress" || status === "Complete";
            }
        }
    },
    description:{
        type: String
    }
});

module.exports = mongoose.model("Tasks", taskSchema);
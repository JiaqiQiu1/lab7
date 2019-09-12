let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongodb = require("mongodb");
let mongoose = require("mongoose");
let Task = require("./models/tasks.js");
let Developer = require("./models/developers.js");
let ObjectId = mongoose.Types.ObjectId;
let app = express();
let router = express.Router();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use("/images",express.static('images'));
app.use("/css",express.static('css'));
app.use(bodyParser.urlencoded({
    extended: false
}));
let url = "mongodb://127.0.0.1:27017/lab7";
let db;
mongoose.connect(url, {useNewUrlParser:true},function(err){
    if (err) throw err
    else console.log("mongoose connected");
});
//The MongoDB Node.js driver rewrote the tool it uses to parse MongoDB connection strings.
//Because this is such a big change, they put the new connection string parser behind a flag.
/*MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });
*/


router.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
  
router.get('/newTask', function (req,res) {
    res.sendFile(__dirname + "/views/newTask.html");
});

router.get('/addDeveloper', function (req,res) {
    res.sendFile(__dirname + "/views/addDeveloper.html");
});
  
router.get('/listTasks', function(req, res){
    let filename = __dirname + "/views/listTasks.html";
    /*db.collection('lab6').find({}).toArray(function (err, result) {
        res.render(filename, {
            database:result
        });
    });*/
    Task.find({}, function(err, docs){
        console.log(docs);
        res.render(filename, {
            database:docs
        });
    });
});

router.get('/listDeveloper', function(req, res){
    let filename = __dirname + "/views/listDeveloper.html";
    /*db.collection('lab6').find({}).toArray(function (err, result) {
        res.render(filename, {
            database:result
        });
    });*/
    Developer.find({}, function(err, docs){
        console.log(docs);
        res.render(filename, {
            database:docs
        });
    });
});

router.post("/deleteOneTask", function (req, res) {
    let deleteid = req.body.TaskID;
    /*db.collection('lab6').deleteOne({ _id: ObjectId(deleteid)}, function(err, result){
        res.redirect('listTasks');
    });*/
    Task.deleteOne({ _id: ObjectId(deleteid)}, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/deleteAllTask", function (req, res) {
    /*db.collection('lab6').deleteMany({}, function(err, result){
        res.redirect('listTasks');
    });*/
    Task.deleteMany({}, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/deleteAllComplete", function (req, res) {
    /*db.collection('lab6').deleteMany({}, function(err, result){
        res.redirect('listTasks');
    });*/
    Task.deleteMany({status:"Complete"}, function(err, result){
        res.redirect('listTasks');
    });
});

router.post("/deleteAllDeveloper", function (req, res) {
    /*db.collection('lab6').deleteMany({}, function(err, result){
        res.redirect('listTasks');
    });*/
    Developer.deleteMany({}, function(err, result){
        res.redirect('listDeveloper');
    });
});

router.post("/addTask", function (req, res) {
    /*db.collection('lab6').insertOne(req.body, function(err, result){
        res.redirect('listTasks');
    });*/
    let newTask = new Task({
        _id: new ObjectId(),
        name: req.body.name,
        assignedTo: new ObjectId(req.body.assignedTo),
        dueDate: req.body.dueDate,
        status: req.body.status,
        description: req.body.description
    });
    console.log(newTask);
    newTask.save(function (err) {
        if (err) throw err;
        console.log('newTask successfully Added to DB');
        res.redirect('listTasks');
    });

});


router.get("/delete", function(req,res){
    res.sendFile(__dirname + "/views/delete.html");
});

router.get("/update", function(req,res){
    res.sendFile(__dirname + "/views/update.html");
});

router.get("/updateFname", function(req,res){
    res.sendFile(__dirname + "/views/updateFname.html");
});

router.post("/updateFname", function(req,res){
    let newfirstName = req.body.fname;
    Developer.updateMany({}, {$set:{ "name.firstName": newfirstName}}, (err, result)=>{
        res.redirect('listDeveloper');
    })

});

router.post("/update", function(req,res){
    let myid = req.body.TaskID;
    let mytaskstate = req.body.TaskStatus;
    /*
    db.collection('lab6').updateOne({_id: ObjectId(myid)}, {$set:{TaskStatus:mytaskstate}}, (err, result)=>{
        res.redirect('listTasks');
    });
    */
    Task.updateOne({_id: ObjectId(myid)}, {$set:{TaskStatus:mytaskstate}}, (err, result)=>{
        res.redirect('listTasks');
    });
});
router.get("/addDeveloper", function(req, res){
    res.sendFile(__dirname + 'listDeveloper.html');
});
router.post("/addDeveloper", function(req, res){

    let newDeveloper = Developer({
        _id: new ObjectId(),
        name:{
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level,
        address:{
            state:req.body.state,
            suburb:req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });
    newDeveloper.save(function (err) {
        if (err) throw err;
        console.log('newTask successfully Added to DB');
        res.redirect('listDeveloper');
    });
    
});




app.use('/', router);
app.listen("8080");
/**
 * ToDo: Package data from other requests and send to DB, need to set up promises for data
 */

const exp = require("express");
const port = process.env.PORT || 10000;
const path = require("path");
const bodyParser = require("body-parser");
const expressSession = require("express-session");


// had to change button Id of second add button for the other request option

//defining routed function files -Homy
const dbfun = require('./routes/searchFunctions.js')
var dbFunctions = require("./routes/dbFunctions");
var roFunctions = require("./routes/roFunctions");

var pF = path.resolve(__dirname, "public");
var app = exp();

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressSession({
    secret:"HIGJLCPJOPUD",
    resave: true,
    saveUninitialized:true
}));

app.use("/scripts", exp.static("build"));
app.use("/css", exp.static("style"));
app.use("/pages",exp.static("public"))

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/", function(req, resp){
    resp.sendFile(pF+"/checkin.html")
});
app.get("/orders", function(req, resp){
    resp.sendFile(pF+"/ro.html")
});

app.use("/data",dbFunctions);
app.use("/rosearch", roFunctions);

//search function from Glenn
app.post("/search", (request,response)=>{
	dbfun.getSearchData(request.body.searchQuery, request.body.searchType).then((result)=>{
		response.send({status: 'OK', data: result})
	}).catch((result)=>{
        console.log(result);
    });
});

app.post("/setVariables",function (req,resp) {
    console.log(req.body);
    req.session.status = req.body;
    console.log(req.session.status);
    resp.send("Successfully set status to:"+ req.body.status);
})

server.listen(10000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    
    console.log(port+" is running");
});


/*app.get("/menu", function(req, resp){
    resp.sendFile(pF+"/menu.html")
});
*/
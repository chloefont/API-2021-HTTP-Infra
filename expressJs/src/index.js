const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json(getTimeJson());
});

app.get("/id", (req, res) => {
    console.log(process.env);
    res.json({id:process.env.NO_SERVER});
});

app.listen(3006, ()=>{
    console.log("Server started")
});


function getTimeJson() {
    var now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDay(),
        hour: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
        };
}


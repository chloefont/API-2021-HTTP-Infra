const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json(getTimeJson());
});

// app.get("/id", (req, res) => {
//     console.log(process.env);
//     res.json({id:process.env.NO_SERVER});
// });

// app.get('*', (req, res)=>{
//     console.log(req.url);
// })

app.listen(3006, ()=>{
    console.log("Server started")
});


function getTimeJson() {
    var now = new Date();

    console.log(process.env.NO_SERVER)
    return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDay(),
        hour: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        noServer: process.env.NO_SERVER
        };
}


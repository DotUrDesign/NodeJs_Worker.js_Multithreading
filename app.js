const express = require('express');
const app = express();
const {Worker} = require('worker_threads');

app.get("/non-blocking", (req, res) => {
    res.status(200).send("This page is non-blocking");
});

app.get("/blocking", async (req, res) => {
    const worker = new Worker("./workers.js");

    worker.on("message", (data) => {
        res.status(200).send(`result is ${data}`);
    });

    worker.on("error", (error) => {
        res.status(404).send(`an error occured ${error}`)
    });
});

app.listen(3000, () => {
    console.log("server is running at port 3000");
})
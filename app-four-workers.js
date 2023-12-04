const express = require('express');
const app = express();
app.use(express.json());
const {Worker} = require('worker_threads');
const THREAD_COUNT = 8;

function createWorker() { 
    return new Promise((resolve, reject) => {
        const worker = new Worker("./four-workers.js", {
            workerData : {thread_count : THREAD_COUNT}
        });

        // worker -> data => resolve(Promise)
        //           error => reject(Promise)

        worker.on("message", (data) => {
            // console.log(data);
            resolve(data);
        });

        worker.on("error", (error) => {
            reject(`an error occured ${error}`)
        });
    })
}

app.get('/blocking', async (req, res) => {
    const workerPromises = [];

    for(let i=0;i<THREAD_COUNT;i++){
        workerPromises.push(createWorker());
    }

    
    let thread_results = await Promise.all(workerPromises);  // wait till all promises are resolved or rejected and then return the value of the promise i.e, 20M/thread_count


    // for(let i=0;i<workerPromises.length;i++)
    //     console.log(workerPromises[i]);
    
    for(let i=0;i<thread_results.length;i++)
        console.log(thread_results[i]);
    

    let total = thread_results[0] + 
                thread_results[1] + 
                thread_results[2] +
                thread_results[3] +
                thread_results[4] +
                thread_results[5] +
                thread_results[6] +
                thread_results[7];
    
    res.status(200).send(`result is ${total}`);
})

app.get('/non-blocking', (req, res) => {
    res.status(200).send("this page is non-blocking");
})

app.listen(4000, () => {
    console.log("server is running at port 4000");
})
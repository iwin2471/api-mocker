const express = require("express");
const app = express();


app.use(express.json());

app.post("/endpoint", (req, res)=> {
    console.log(req.body)
    app.get(req.body.path, (req, res)=> {
        return res.status(200).send("hello world")
    });

    return res.status(200).send()
});

app.listen(3000, () => console.log("server running"))
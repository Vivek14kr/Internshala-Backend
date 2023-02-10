const app = require('./app')

const connect = require("./configs/dbs.js")


app.listen(3232, async (req, res)=>{
    await connect()
    console.log("Server is running on port 3232")
})
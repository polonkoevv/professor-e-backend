import express  from "express";
import cors from "cors"
import path from 'path'
import pino from "./logger/logger.js"
import dotenv from 'dotenv'
import ProductController from "./controller/product.controller.js";
import ProductRouter from "./router/product.router.js";
import bodyParser from "body-parser";
import SizeRouter from "./router/size.router.js";
import UserRouter from "./router/user.router.js";
const __dirname = path.resolve()

dotenv.config()

// Создание сервера
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors()) 
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '')))


app.use("/api", ProductRouter)
app.use("/api", SizeRouter)
app.use("/api", UserRouter)

const PORT = process.env.APP_PORT || 3000

app.listen(PORT, async () =>{
    pino.info(`server is listening on ${PORT}`)


        // console.log(await sizeS.AddOne("123"))

        // let rs = await ss.GetAll()
        // console.log(rs)

        // console.log(await ss.LinkImages(1, [2,4,5]))



        // console.log(
        //     await ss.AddOne(
        //         "test", 123, "test", "preview", ["img", "img"], ["note", "note"], ["mat", "mat"], [1,2,3,4,5] 
        //     )
        // )
    
})
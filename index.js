import express  from "express";
import cors from "cors"
import path from 'path'
import pino from "./logger/logger.js"
import dotenv from 'dotenv'
import SizeService from "./service/size.service.js";
import Size from "./models/size.model.js";
import ImageService from "./service/image.service.js";
import MaterialService from "./service/material.service.js";
import NoteService from "./service/note.service.js";
import ProductService from "./service/product.service.js";
const __dirname = path.resolve()

dotenv.config()

// Создание сервера
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors()) 

app.use(express.static(path.resolve(__dirname, 'static')))
let ss = new ProductService()
let sizeS = new SizeService()

app.get("/size", async (req, res) => {res.send(await ss.GetAll())})

const PORT = process.env.APP_PORT || 3000

app.listen(PORT, async () =>{
    pino.info(`server is listening on ${PORT}`)


        // console.log(await sizeS.AddOne("123"))

        // let rs = await ss.GetAll()
        // console.log(rs)

        // console.log(await ss.LinkImages(1, [2,4,5]))



        console.log(
            await ss.AddOne(
                "test", 123, "test", "preview", ["img", "img"], ["note", "note"], ["mat", "mat"], [1,2,3,4,5] 
            )
        )
    
})
import pool from "../storage/connections.js"
import pino from "../logger/logger.js"

class ImageService{

     async GetAll(){
        try {
            let res = await pool.query("SELECT * FROM image;")
            // pino.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetById(image_id){
        try {
            let res = await pool.query("SELECT * FROM image WHERE image_id = ?;", [image_id])
            // pino.log(res)
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAllByProdId(product_id){
        try {
            let raw = (await pool.query("SELECT * FROM product_to_image WHERE product_id = ?;", [product_id]))[0]
            // pino.log(res)
            let res = []
            for (let i = 0; i < raw.length; i++){
                let temp = (await this.GetById(raw[i].image_id))
                res.push(
                    temp
                )
            }

            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }


    async AddOne(path){
        try {
            let res = await pool.query("INSERT INTO image SET path = ?", [path])
            
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }

    }

    async AddMany(images){
        try {
            let ids = []
            for (let i = 0; i < images.length; i++){
                let id = await this.AddOne(images[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }
    

    async DeleteOne(image_id){
        try {
            let res = await pool.query("DELETE FROM image WHERE image_id = ?", image_id)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateOne(image_id, path){
        try {
            let res = await pool.query("UPDATE image SET path = ? WHERE image_id = ?", [path, image_id])
            console.log("res", res[0])
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateMany(image_ids, images){
        try {
            let ids = []
            for (let i = 0; i < images.length; i++){
                let id = await this.UpdateOne(image_ids[i].image_path, images[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }
}

export default new ImageService()
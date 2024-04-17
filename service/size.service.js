import pool from "../storage/connections.js"
import pino from "../logger/logger.js"

class SizeService{

     async GetAll(){
        try {
            let res = await pool.query("SELECT * FROM size;")
            // pino.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetById(size_id){
        try {
            let res = await pool.query("SELECT * FROM size WHERE size_id = ?;", [size_id])
            // pino.log(res)
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAllByProdId(product_id){
        try {
            let raw = (await pool.query("SELECT * FROM product_to_size WHERE product_id = ?;", [product_id]))[0]
            // pino.log(res)
            let res = []
            for (let i = 0; i < raw.length; i++){
                let temp = (await this.GetById(raw[i].size_id))
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


    async AddOne(name){
        try {
            let res = await pool.query("INSERT INTO size SET name = ?", [name])
            
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }

    }

    async AddMany(sizes){
        try {
            let ids = []
            for (let i = 0; i < sizes.length; i++){
                let id = await this.AddOne(sizes[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async DeleteOne(size_id){
        try {
            let res = await pool.query("DELETE FROM size WHERE size_id = ?", size_id)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateOne(size_id, name){
        try {
            let res = await pool.query("UPDATE size SET name = ? WHERE size_id = ?", [name, size_id])
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }
}

export default new SizeService()
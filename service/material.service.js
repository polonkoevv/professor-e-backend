import pool from "../storage/connections.js"
import pino from "../logger/logger.js"

class MaterialService{

     async GetAll(){
        try {
            let res = await pool.query("SELECT * FROM material;")
            // pino.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetById(material_id){
        try {
            let res = await pool.query("SELECT * FROM material WHERE material_id = ?;", [material_id])
            // pino.log(res)
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAllByProdId(product_id){
        try {
            let raw = (await pool.query("SELECT * FROM product_to_material WHERE product_id = ?;", [product_id]))[0]
            // pino.log(res)
            let res = []
            for (let i = 0; i < raw.length; i++){
                let temp = (await this.GetById(raw[i].material_id))
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
            let res = await pool.query("INSERT INTO material SET name = ?", [name])
            
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }

    }

    async AddMany(materials){
        try {
            let ids = []
            for (let i = 0; i < materials.length; i++){
                let id = await this.AddOne(materials[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }
    

    async DeleteOne(material_id){
        try {
            let res = await pool.query("DELETE FROM material WHERE material_id = ?", material_id)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateOne(material_id, name){
        try {
            let res = await pool.query("UPDATE material SET name = ? WHERE material_id = ?", [name, material_id])
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateMany(material_ids, materials){
        try {
            let ids = []
            for (let i = 0; i < materials.length; i++){
                let id = await this.UpdateOne(material_ids[i].material_id, materials[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }
}

export default new MaterialService()
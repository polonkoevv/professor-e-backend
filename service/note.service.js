import pool from "../storage/connections.js"
import pino from "../logger/logger.js"

class NoteService{

     async GetAll(){
        try {
            let res = await pool.query("SELECT * FROM note;")
            // pino.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetById(note_id){
        try {
            let res = await pool.query("SELECT * FROM note WHERE note_id = ?;", [note_id])
            // pino.log(res)
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAllByProdId(product_id){
        try {
            let res = (await pool.query("SELECT note_id, text FROM note WHERE product_id = ?;", [product_id]))[0]
            
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }


    async AddOne(product_id, text){
        try {
            let res = await pool.query("INSERT INTO note SET product_id = ?, text = ?", [product_id, text])
            
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }

    }

    async AddMany(product_id, notes){
        try {
            let ids = []
            for (let i = 0; i < notes.length; i++){
                let id = await this.AddOne(product_id, notes[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async DeleteOne(note_id){
        try {
            let res = await pool.query("DELETE FROM note WHERE note_id = ?", note_id)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateOne(note_id, text){
        try {
            let res = await pool.query("UPDATE note SET text = ? WHERE note_id = ?", [text, note_id])
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateMany(notes_ids, notes){
        try {
            let ids = []
            console.log("notes", notes_ids)
            for (let i = 0; i < notes.length; i++){
                let id = await this.UpdateOne(notes_ids[i].note_id, notes[i])
                ids.push(id)
            }
            return ids
        } catch (error) {
            pino.error(error)
            return error
        }
    }
}

export default new NoteService()
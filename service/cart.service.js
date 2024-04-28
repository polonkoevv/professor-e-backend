import pool from "../storage/connections.js"
import pino from "../logger/logger.js"

class CartService{

    async AddOne(user_id){
        try {

            let res = await pool.query("INSERT INTO cart SET user_id = ?;", [user_id])

            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetByUserId(user_id){
        try {
            let res = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?;", [user_id])
            console.log(res)
            return res[0][0].cart_id
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetRowByProductIdAndCartId(cart_id, product_id){
        try {
            let res = await pool.query("SELECT * FROM cart_to_product WHERE cart_id = ? AND product_id = ?;", [cart_id, product_id])
            console.log(res)
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetProductsByUserId(user_id){
        try {
            let cart_id = await this.GetByUserId(user_id)
            let res = await pool.query("SELECT * FROM cart_to_product WHERE cart_id = ?", [cart_id])
            console.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

}

export default new CartService() 
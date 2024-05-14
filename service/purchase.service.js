import pool from "../storage/connections.js"
import pino from "../logger/logger.js"
import cartService from "./cart.service.js"
import userService from "./user.service.js"
import productService from "./product.service.js"
class purchaseService{
    async Add(user_id, commentary, total_price){
        try {
            let cart = await cartService.GetProductsByUserId(user_id)

            let temp = await pool.query("INSERT INTO purchase SET user_id = ?, commentary = ?, total_price = ?;", [user_id, commentary, total_price])
            let id = temp[0].insertId
            
            
            let insert = []
            
            for (let i = 0; i < cart.length; i++){
                insert.push([id, cart[i].product_id, cart[i].quantity])
                await userService.DeleteAllOneProductFromCart(user_id, cart[i].product_id)
            }
            
            let query = "INSERT INTO purchase_to_prod (purchase_id, product_id, quantity) VALUES ?"

            let res = await pool.query(query, [insert])

            return res
        } catch (err) {
            pino.error(err)
            return err
        }
    }

    async GetByUserId(user_id){
        try {

            let res = await pool.query(
                "SELECT * FROM purchase WHERE user_id = ?",
                [user_id]
            )

            let purchase = res[0]


            for (let i = 0; i < purchase.length; i++){
                let prods = await this.GetProductsByPurchaseId(purchase[i].purchase_id)
                purchase[i].products = prods
            }
            
            return purchase
        } catch (err) {
            pino.error(err)
            return err
        }
    }

    // select p.purchase_id, p.user_id, p.commentary, p.total_price, p.date, pp.product_id, pp.quantity from purchase as p left join purchase_to_prod as pp on p.purchase_id = pp.purchase_id where p.user_id = ?;

    async GetProductsByPurchaseId(purchase_id){
        try {

            let res = await pool.query(
                "SELECT product_id, quantity FROM purchase_to_prod WHERE purchase_id = ?",
                [purchase_id]
            )

            let temp = []

            for (let i = 0; i < res[0].length; i++){
                let pr = await productService.GetById(res[0][i].product_id)
                pr.quantity = res[0][i].quantity
                temp.push(pr)
            }
            return temp
        } catch (err) {
            pino.error(err)
            return err
        }
    }

    
}

export default new purchaseService()
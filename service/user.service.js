import pool from "../storage/connections.js"
import pino from "../logger/logger.js"
import cartService from "./cart.service.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
class UserService{

    async Register(user){
        try {
            let res = await pool.query("INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phonenumber = ?, password = ?", [user.first_name, user.last_name, user.email, user.phonenumber, user.password])
            let cart = await cartService.AddOne(res[0].insertId)
            return res[0].insertId
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAll(){
        try {
            let res = await pool.query("SELECT * FROM user;")
            // pino.log(res)
            return res[0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetByEmail(email){
        try {
            pino.info(email)
            let res = await pool.query(`SELECT * FROM user WHERE email = ?`, [email])
            return res[0][0]
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async Login(email, password) {
        try {
            let user

            pino.info("Login type email")
            user = await this.GetByEmail(email)

            console.log(user) 

            if (user == null){
                return null
            }

            if (!bcrypt.compareSync(password, user.password)){
                return null
            }

            const token = jwt.sign(
                {
                user_id: user.user_id
            }, process.env.TOKEN_KEY, {expiresIn: "2h", algorithm: "HS256"});

            return token
        } catch (error) {
            pino.error(error)
            return error
        }
        
    }

    async AddProductToCart(user_id, product_id){
        try {
            let cart_id = await cartService.GetByUserId(user_id)
            console.log("CARTID PRODID:", cart_id, product_id)

            let exists = await cartService.GetRowByProductIdAndCartId(cart_id, product_id)
            console.log("EXISTS:", exists)
            if (exists.length > 0){
                let res = await pool.query("UPDATE cart_to_product SET quantity = quantity + 1 WHERE cart_id = ? AND product_id = ?;", [cart_id, product_id])
                console.log(res)
                return res
            }

            let res = await pool.query("INSERT INTO cart_to_product SET cart_id = ?, product_id = ?;", [cart_id, product_id])
            console.log(res)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async DeleteAllOneProductFromCart(user_id, product_id){
        try {
            let cart_id = await cartService.GetByUserId(user_id)
            console.log(cart_id, product_id)

            let exists = (await cartService.GetRowByProductIdAndCartId(cart_id, product_id))[0]
            console.log("exists", exists)
            if (exists != undefined && exists != null){
                let res = await pool.query("DELETE FROM cart_to_product WHERE cart_id = ? AND product_id = ?;", [cart_id, product_id])
                console.log(res)
                return res
            }

            return null
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async DeleteOneProductFromcart(user_id, product_id){
        try {
            let cart_id = await cartService.GetByUserId(user_id)
            console.log(cart_id, product_id)

            let exists = (await cartService.GetRowByProductIdAndCartId(cart_id, product_id))[0]
            console.log("exists", exists)
            if (exists != undefined && exists != null){
                if (exists.quantity > 1){
                    let res = await pool.query("UPDATE cart_to_product SET quantity = quantity - 1 WHERE cart_id = ? AND product_id = ?;", [cart_id, product_id])
                    console.log(res)
                    return res
                }
                else{
                    let res = await pool.query("DELETE FROM cart_to_product WHERE cart_id = ? AND product_id = ?;", [cart_id, product_id])
                    console.log(res)
                    return res
                }
            }

            return null
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async FlushCart(user_id){
        try {
            let cart_id = await cartService.GetByUserId(user_id)
            console.log(cart_id, product_id)

            if (cart_id != null){
                let res = await pool.query("DELETE FROM cart_to_product WHERE cart_id = ?", [cart_id])
                console.log(res)
                return res
            }

            return null
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetBio(user_id){
        try {
            let user = await pool.query("SELECT * FROM user WHERE user_id = ?;", [user_id])
            let cart = await cartService.GetProductsByUserId(user_id)
            // user = user[0]
            // user[0].cart = cart
            let res = user[0][0]
            res.cart = cart
            // pino.log(res)
            // return {
            //     user: user[0],
            //     cart: cart
            // }
            console.log(res)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

}

export default new UserService()
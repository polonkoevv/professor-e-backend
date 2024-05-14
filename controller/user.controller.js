import pino from "../logger/logger.js"
import User from "../models/user.model.js"
import SizeService from "../service/size.service.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {validationResult} from "express-validator"
import purchaseService from "../service/purchase.service.js"

class UserController{

    async Register(req, res){
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).send({errors : errors.errors})
                return
            }

            let password = await bcrypt.hash(req.body.password, 10)

            let user = new User(
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phonenumber,
                password
            )

            let result = await userService.Register(user)
            // pino.info
            res.json({
                id: result
            })            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async GetAll(req, res){
        try {
            let users = await userService.GetAll()
            res.json(users)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async Login(req, res){
        try {
            let email = req.body.email
            let password = req.body.password

            console.log(email)

            let result = await userService.Login(email, password)

            if (result == null){
                res.status(401).json({error: "invalid login data"})
                return
            }
            
            res.json({"token": result})
            return       
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async AddProductToCart(req, res){
        try {
            let product_id = req.body.product_id
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            // console.log(token)
            console.log("USER_ID:", decoded.user_id)

            let r = await userService.AddProductToCart(user_id, product_id)

            res.status(201).json()      
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }


    async GetCart(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            console.log(token)
            console.log(decoded)

            let r = await userService.GetBio(user_id)
            res.status(201).json(r)   
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async DeleteAllOneProductFromCart(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            console.log(token)
            console.log(decoded)

            let product_id = req.params.product_id

            let r = await userService.DeleteAllOneProductFromCart(user_id, product_id)
            res.status(201).json(r)  
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async DeleteOneProductFromcart(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            console.log(token)
            console.log(decoded)

            let product_id = req.params.product_id

            let r = await userService.DeleteOneProductFromcart(user_id, product_id)
            res.status(201).json(r)   
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async FlushCart(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            console.log(token)
            console.log(decoded)

            let r = await userService.FlushCart(user_id)

            if (r == null){
                res.status(400).json({error: "user and cart dont exist"})
            }

            res.status(201).json({
                user: r
            })              
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async Purchase(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id
            let total_price = req.body.total_price
            let commentary = req.body.commentary

            let r = await purchaseService.Add(user_id, commentary, total_price)

            res.status(201).json()

        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async GetPurchases(req, res){
        try {
            let authHeader = req.headers.authorization
            if (authHeader == null){
                return res.status(401).send()
            }
            let token = authHeader.split(" ")[1]
            let decoded = jwt.decode(token)
            let user_id = decoded.user_id

            let r = await purchaseService.GetByUserId(user_id)
            res.status(200).json(r)
        }catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }
}

export default new UserController()
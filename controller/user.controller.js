import pino from "../logger/logger.js"
import SizeService from "../service/size.service.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"

class UserController{

    async AddOne(req, res){
        try {
            let user = await userService.Register(req.body)
            // pino.info
            res.json({
                id: user
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
                res.status(400)
                res.send(result)
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

            console.log(token)
            console.log(decoded)

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
            res.status(201).json({
                user: r
            })   
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
            res.status(201).json({
                user: r
            })   
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }
}

export default new UserController()
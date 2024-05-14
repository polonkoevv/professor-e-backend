import jwt from "jsonwebtoken"
import pool from "../storage/connections.js"
import pino from "../logger/logger.js"
import userService from "../service/user.service.js"

class authMiddlewares {
    // Проверка валидности jwt токена
     
    async checkToken(req, res, next){
        
        pino.info("verifieng JWT token")
        let authHeader = req.headers.authorization
        if (authHeader == null){
            pino.error("auth headers  do not exist")
            return res.status(401).send()
        }
        let token = authHeader.split(" ")[1]
        try {
            jwt.verify(token, process.env.TOKEN_KEY)
        } catch (error) {
            pino.error(error.message)
            return res.status(401).send()
        }

        let decoded = jwt.decode(token)
        let checkDb = await userService.GetBio(decoded.user_id)
        // console.log("cjcjc", checkDb)
        if (checkDb.user_id == null || decoded.user_id == null){
            pino.error(`user does not exist; `)
            return res.status(401).send()
        }
        next()
    }
}

export default new authMiddlewares()
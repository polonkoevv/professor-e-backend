import jwt from "jsonwebtoken"
import { pool } from "../storage/connection.js"
import pino from "../logger/logger.js"

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
        let checkDb = await pool.query("SELECT * FROM user WHERE user_id = ?", [decoded.id])
        if (checkDb[0].length < 1 || decoded.id == null){
            pino.error(`user does not exist; `)
            return res.status(401).send()
        }
        next()
    }
}

export default new authMiddlewares()
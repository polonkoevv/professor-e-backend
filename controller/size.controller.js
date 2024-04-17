import pino from "../logger/logger.js"
import SizeService from "../service/size.service.js"
class SizeController{
    constructor(){
        this.sizeService = new SizeService()
    }

    async GetAll(req, res){
        try {
            let sizes = await this.sizeService.GetAll()
            res.send(sizes)            
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
            return error
        }
    }

    async GetById(req, res){
        try {
            let size_id = req.params.size_id
            let sizes = await this.sizeService.GetById(size_id)
            res.send(sizes)            
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
            return error
        }
    }

    async AddOne(req, res){
        try {
            let name = req.body.name
            let size = 
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
            return error
        }
    }
}
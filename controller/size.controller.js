import pino from "../logger/logger.js"
import SizeService from "../service/size.service.js"
class SizeController{

    async GetAll(req, res){
        try {
            let sizes = await SizeService.GetAll()
            res.json(sizes)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async GetOne(req, res){
        try {
            let size_id = req.params.size_id
            let sizes = await SizeService.GetById(size_id)
            res.json(sizes)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async AddOne(req, res){
        try {
            let name = req.body.name
            console.log(name)
            let size = await SizeService.AddOne(name)
            res.status(201).json()
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async DeleteOne(req, res){
        try {
            let id = req.params.size_id
            let size = await SizeService.DeleteOne(id)
            pino.info(`Size deleted: id = ${id}`)
            res.json(size)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }
}

export default new SizeController()
import pino from "../logger/logger.js"
import ProductService from "../service/product.service.js"
class ProductController{
    

    async GetAll(req, res){
        try {
            let products = await ProductService.GetAll()
            pino.info("Getting all products")
            res.json(products)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async GetOne(req, res){
        try {
            let id = req.params.product_id
            // console.log(ProductService)
            let products = await ProductService.GetById(id)
            pino.info(`Product sent: id = ${id}`)
            res.json(products)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async AddOne(req, res){
        try {

            console.log(req.files)

            let preview = req.files[0].path

            preview = preview.replaceAll(/\\/g, "\/")


            let images = []

            for (let i = 1; i < req.files.length; i++){
                images.push(req.files[i].path.replaceAll(/\\/g, "\/"))
            }

            let {name, price, description, sizes, materials, notes} = req.body

            console.log(name, price, description, sizes, materials, notes)

            let product = ProductService.AddOne(
                name, price, description,
                preview,
                images,
                notes,
                materials,
                sizes
            )
            pino.info(`Product added: id = ${product}`)

            // console.log(typeof(notes))

            // console.log(preview)
            // console.log(images)

            res.json(product)
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }

    async DeleteOne(req, res){
        try {
            let id = req.params.product_id
            let products = await ProductService.DeleteOne(id)
            pino.info(`Product deleted: id = ${id}`)
            res.json(products)            
        } catch (error) {
            pino.error(error)
            res.status(400).json(error)
            return error
        }
    }
}

export default new ProductController()
import pino from "../logger/logger.js"
import ProductService from "../service/product.service.js"
class ProductController{
    

    async GetAll(req, res){
        try {
            // console.log(ProductService)
            let products = await ProductService.GetAll()
            pino.info("getting all products")
            res.send(products)            
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
            return error
        }
    }

    async GetOne(req, res){
        try {
            let id = req.params.product_id
            // console.log(ProductService)
            let products = await ProductService.GetById(id)
            res.send(products)            
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
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

            console.log(typeof(notes))

            console.log(preview)
            console.log(images)

            res.send()
        } catch (error) {
            pino.error(error)
            res.status(400).send(error)
            return error
        }
    }

    // async DeleteOne(req, res){
    //     try {
    //         let id = req.params.product_id
    //         // console.log(ProductService)
    //         let products = await ProductService.DeleteOne(id)
    //         res.send(products)            
    //     } catch (error) {
    //         pino.error(error)
    //         res.status(400).send(error)
    //         return error
    //     }
    // }
}

export default new ProductController()
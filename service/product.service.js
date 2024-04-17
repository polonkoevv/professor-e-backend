import pool from "../storage/connections.js"
import ImageService from "./image.service.js"
import MaterialService from "./material.service.js"
import SizeService from "./size.service.js"
import NoteService from "./note.service.js"
import Product from "../models/product.model.js"
import pino from "../logger/logger.js"

class ProductService{

    constructor(){
        this.materialService = new MaterialService()
        this.noteService = new NoteService()
        this.sizeService = new SizeService()
        this.imageService = new ImageService()
    }

     async GetAll(){
        try {
            let ids = (await pool.query("SELECT product_id FROM product;"))[0]

            // console.log(ids)
            let res = []

            for (let i = 0; i < ids.length; i++){
                res.push(await this.GetById(
                    ids[i].product_id
                ))
            }

            // pino.log(res)
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetById(product_id){
        try {

            let raw = (await pool.query("SELECT * FROM product WHERE product_id = ?;", [product_id]))[0][0]

            // console.log(product)

            let notes = await this.noteService.GetAllByProdId(product_id)

            let images = await this.imageService.GetAllByProdId(product_id)

            let materials = await this.materialService.GetAllByProdId(product_id)

            let sizes = await this.sizeService.GetAllByProdId(product_id)

            let preview = await this.imageService.GetById(raw.preview_id)

            let res = new Product(
                raw.product_id,
                raw.name,
                raw.price,
                raw.description,
                preview,
                images,
                notes,
                materials,
                sizes
            )

            return res

        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async GetAllByProdId(product_id){
        try {
            let res = (await pool.query("SELECT note_id, text FROM note WHERE product_id = ?;", [product_id]))[0]
            
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }


    async LinkImages(product_id, image_ids){
        try {

            let q = ""

            for (let i = 0; i < image_ids.length; i++){
                q += `(${product_id}, ${image_ids[i]}),`
            }

            q = q.slice(0,-1)

            let query = `INSERT INTO product_to_image (product_id, image_id) VALUES ${q};`

            let res = (await pool.query(query))[0]
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async LinkSizes(product_id, size_ids){
        try {

            let q = ""

            for (let i = 0; i < size_ids.length; i++){
                q += `(${product_id}, ${size_ids[i]}),`
            }

            q = q.slice(0,-1)

            let query = `INSERT INTO product_to_size (product_id, size_id) VALUES ${q};`

            let res = (await pool.query(query))[0]
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async LinkMaterials(product_id, material_ids){
        try {

            let q = ""

            for (let i = 0; i < material_ids.length; i++){
                q += `(${product_id}, ${material_ids[i]}),`
            }

            q = q.slice(0,-1)

            let query = `INSERT INTO product_to_material (product_id, material_id) VALUES ${q};`

            let res = (await pool.query(query))[0]
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }


    async AddOne(name, price, description, preview, images, notes, materials, sizes){
        try {
            let pr_id = await this.imageService.AddOne(preview)
            let img_ids = await this.imageService.AddMany(images)
            
            let mat_ids = await this.materialService.AddMany(materials)

            let q = `INSERT INTO product SET name = ?, price = ?, description = ?, preview_id = ?;`

            let prod = (await pool.query(q, [
                name, price, description, pr_id
            ]))[0]

            let prod_id = prod.insertId

            let note_ids = await this.noteService.AddMany(prod_id, notes)
            
            await this.LinkImages(prod_id, img_ids)
            await this.LinkMaterials(prod_id, mat_ids)
            await this.LinkSizes(prod_id, sizes)

            return prod_id
        } catch (error) {
            pino.error(error)
            return error
        }

    }
}

export default ProductService
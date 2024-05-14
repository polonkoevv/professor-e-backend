import pool from "../storage/connections.js"
import ImageService from "./image.service.js"
import MaterialService from "./material.service.js"
import SizeService from "./size.service.js"
import NoteService from "./note.service.js"
import Product from "../models/product.model.js"
import pino from "../logger/logger.js"

class ProductService{

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

    async GetNextById(product_id){
        try {

            let raw = (await pool.query("SELECT * FROM product WHERE product_id > ? ORDER BY product_id ASC LIMIT 1;", [product_id]))[0][0]

            // console.log(product)
            pino.info(raw)

            let preview = await ImageService.GetById(raw.preview_id)
            let notes = await NoteService.GetAllByProdId(product_id)
            let images = await ImageService.GetAllByProdId(product_id)
            let materials = await MaterialService.GetAllByProdId(product_id)
            let sizes = await SizeService.GetAllByProdId(product_id)
            pino.info(preview)
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
    

    async GetPrevById(product_id){
        try {

            let raw = (await pool.query("SELECT * FROM product WHERE product_id < ? ORDER BY product_id DESC LIMIT 1;", [product_id]))[0][0]

            // console.log(product)
            pino.info(raw)

            let preview = await ImageService.GetById(raw.preview_id)
            let notes = await NoteService.GetAllByProdId(product_id)
            let images = await ImageService.GetAllByProdId(product_id)
            let materials = await MaterialService.GetAllByProdId(product_id)
            let sizes = await SizeService.GetAllByProdId(product_id)
            pino.info(preview)
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

    async GetById(product_id){
        try {

            let raw = (await pool.query("SELECT * FROM product WHERE product_id = ?;", [product_id]))[0][0]

            // console.log(product)
            pino.info(raw)

            let preview = await ImageService.GetById(raw.preview_id)
            let notes = await NoteService.GetAllByProdId(product_id)
            let images = await ImageService.GetAllByProdId(product_id)
            let materials = await MaterialService.GetAllByProdId(product_id)
            let sizes = await SizeService.GetAllByProdId(product_id)
            pino.info(preview)
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
            let pr_id = await ImageService.AddOne(preview)
            let img_ids = await ImageService.AddMany(images)
            
            let mat_ids = await MaterialService.AddMany(materials)

            let q = `INSERT INTO product SET name = ?, price = ?, description = ?, preview_id = ?;`

            let prod = (await pool.query(q, [
                name, price, description, pr_id
            ]))[0]

            let prod_id = prod.insertId

            let note_ids = await NoteService.AddMany(prod_id, notes)
            
            await this.LinkImages(prod_id, img_ids)
            await this.LinkMaterials(prod_id, mat_ids)
            await this.LinkSizes(prod_id, sizes)

            return prod_id
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async DeleteOne(product_id){
        try {


            let res = await pool.query("DELETE FROM product WHERE product_id = ?", [product_id])
            
            return res
        } catch (error) {
            pino.error(error)
            return error
        }
    }

    async UpdateOne(product_id, name, price, description, preview, images, notes, materials, sizes){
        try {

            console.log("prev", preview)
            let product = await this.GetById(product_id)
            let pr_id
            if (preview != null){
                console.log("image", product.preview)
                pr_id = await ImageService.UpdateOne(product.preview.image_id, preview)
            }

            if (images != []){
                let img_ids = await ImageService.AddMany(images)
                await this.LinkImages(product_id, img_ids)

                for (let i = 0; i < product.images.length; i++){
                    await ImageService.DeleteOne(product.images[i].image_id)
                }
            }
            
            let mat_ids = await MaterialService.UpdateMany(product.materials, materials)
            let prod = ""
            let q = `UPDATE product SET name = ?, price = ?, description = ? WHERE product_id = ?`

            prod = (await pool.query(q, [
                name, price, description, product_id
            ]))[0]
            

            

            

            let note_ids = await NoteService.UpdateMany(product.notes, notes)
            
            
            return product.product_id
        } catch (error) {
            pino.error(error)
            return error
        }
    }
}

export default new ProductService()
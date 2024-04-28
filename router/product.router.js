import {Router} from "express";
import multer from "multer";
import {nanoid} from "nanoid";
import productController from "../controller/product.controller.js";

const ProductRouter = Router()


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, `static/uploads`);
    },
    filename: (req, file, cb) =>{
        const name = Buffer.from(file.originalname, 'latin1').toString('utf8')

        cb(null, `${nanoid(10)}_${name}`);
    }
});

const upload = multer({storage:storageConfig});

ProductRouter.get("/product", productController.GetAll)
ProductRouter.get("/product/:product_id", productController.GetOne)

ProductRouter.post("/product", upload.any('images'), productController.AddOne)
ProductRouter.delete("/product/:product_id", productController.DeleteOne)

export default ProductRouter
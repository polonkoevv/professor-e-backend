import {Router} from "express";
import UserController from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import RequestValidator from "../middleware/validator.middleware.js"
const UserRouter = Router()

UserRouter.get("/user", UserController.GetAll)
UserRouter.post("/register", RequestValidator.register, UserController.Register)
UserRouter.post("/user/add", UserController.AddProductToCart)
UserRouter.post("/login",  UserController.Login)
UserRouter.get("/cart", authMiddleware.checkToken, UserController.GetCart)
UserRouter.delete("/cart/:product_id/all",  UserController.DeleteAllOneProductFromCart)
UserRouter.delete("/cart/:product_id",  UserController.DeleteOneProductFromcart)
UserRouter.delete("/cart",  UserController.FlushCart)
UserRouter.post("/cart/purchase",authMiddleware.checkToken, UserController.Purchase)
UserRouter.get("/user/purchase",authMiddleware.checkToken, UserController.GetPurchases)

export default UserRouter
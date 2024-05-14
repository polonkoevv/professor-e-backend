import {Router} from "express";
import UserController from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import RequestValidator from "../middleware/validator.middleware.js"
const UserRouter = Router()

UserRouter.get("/user", UserController.GetAll)
UserRouter.post("/register", RequestValidator.register, UserController.Register)
UserRouter.post("/user/add", authMiddleware.checkToken, UserController.AddProductToCart)
UserRouter.post("/login",  UserController.Login)
UserRouter.get("/cart", authMiddleware.checkToken, UserController.GetCart)
UserRouter.delete("/cart/:product_id/all", authMiddleware.checkToken,  UserController.DeleteAllOneProductFromCart)
UserRouter.delete("/cart/:product_id",  authMiddleware.checkToken, UserController.DeleteOneProductFromcart)
UserRouter.delete("/cart", authMiddleware.checkToken,  UserController.FlushCart)
UserRouter.post("/cart/purchase",authMiddleware.checkToken, UserController.Purchase)
UserRouter.get("/user/purchase",authMiddleware.checkToken, UserController.GetPurchases)

export default UserRouter
import {Router} from "express";
import UserController from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const UserRouter = Router()

UserRouter.get("/user", UserController.GetAll)
UserRouter.post("/register",  UserController.AddOne)
UserRouter.post("/user/add", UserController.AddProductToCart)
UserRouter.post("/login",  UserController.Login)
UserRouter.get("/cart",  UserController.GetCart)
UserRouter.delete("/cart/:product_id",  UserController.DeleteOneProductFromcart)

export default UserRouter
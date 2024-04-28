import {Router} from "express";
import UserController from "../controller/user.controller.js";

const UserRouter = Router()

UserRouter.get("/user", UserController.GetAll)
UserRouter.post("/user",  UserController.AddOne)
UserRouter.post("/user/add",  UserController.AddProductToCart)
UserRouter.get("/login",  UserController.Login)
UserRouter.get("/cart",  UserController.GetCart)
// UserRouter.get("/user/:user_id", UserController.GetOne)
// UserRouter.delete("/user/:user_id", UserController.DeleteOne)

export default UserRouter
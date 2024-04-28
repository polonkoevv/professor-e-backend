import {Router} from "express";
import SizeController from "../controller/size.controller.js";

const SizeRouter = Router()

SizeRouter.get("/size", SizeController.GetAll)
SizeRouter.get("/size/:size_id", SizeController.GetOne)
SizeRouter.post("/size",  SizeController.AddOne)
SizeRouter.delete("/size/:size_id", SizeController.DeleteOne)

export default SizeRouter
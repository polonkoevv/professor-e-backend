import {body} from "express-validator"

// req.body.first_name,
// req.body.last_name,
// req.body.email,
// req.body.phonenumber,
// password

class RequestValidator{


    register = [
        body("first_name")
        .exists()
        .withMessage("Имя обязательно")
        .isLength({min: 4})
        .withMessage("Имя должно быть длиннее 5 символов"),

        body("last_name")
        .exists()
        .withMessage("Фамилия обязательна")
        .isLength({min: 5})
        .withMessage("Фамилия должна быть длиннее 5 символов"),

        body("email")
        .exists()
        .withMessage("Email обязателен")
        .isEmail()
        .withMessage("Неправильный email"),

        body("phonenumber")
        .exists()
        .withMessage("Номер телефона обязателен")
        .isLength({min:11, max: 11})
        .withMessage("Неправильный номер телефона"),

        body("password")
        .exists({checkNull: true})
        .withMessage("Ввод пароля обязателен")
        .isLength({min: 6})
        .withMessage("Длина пароля должна быть больше 6")
    ]


    addProduct = [
        body("name")
        .exists({ checkFalsy: true })
        .withMessage("Ввод названия обязателен")
        .isLength({min: 8})
        .withMessage("Название должно быть длиннее 8 символов"),

        body("price")
        .exists({checkNull: true})
        .withMessage("Ввод цены обязателен")
        .isNumeric()
        .withMessage("Цена должна быть числовой"),

        body("description")
        .exists()
        .withMessage("Ввод описания обязателен")
        .isLength({min: 20})
        .withMessage("Минимальная длина описания 20 символов"),

        body("images")
        .exists()
        .withMessage("Фото обязательны")
        .isLength({min: 2})
        .withMessage("Нужно как минимум 2 фото - 1 превью и 1 в галерею"),

        body("materials")
        .exists()
        .withMessage("Ввод материалов обязателен"),

        body("sizes")
        .exists()
        .withMessage("Ввод размеров обязателен")
    ]

}

export default new RequestValidator()
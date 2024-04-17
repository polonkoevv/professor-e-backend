import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config()

let pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE

    // host: "127.0.0.1",
    // port: 3306,
    // user: "root",
    // password: "rootRoot123!@.",
    // database: "pillars"
}).promise()

export default pool
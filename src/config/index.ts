import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd() , '.env')})


const config = {
    connectionStr : process.env.CONNECTION_STR,
    port: process.env.PORT,
    jwtSecret: process.env.SECRET
}

export default config
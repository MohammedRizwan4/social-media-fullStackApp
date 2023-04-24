import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
// comes in node for path
import path from "path"
import { fileURLToPath } from 'url'
import {register} from './controllers/auth.js';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'

/* Configuration */

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* File Storage*/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });

app.post('/auth/register',upload.single("picture"),register)
app.use('/auth',authRoutes)
app.use('/users',userRoutes)
app.use('/post',postRoutes)

// Mongoose setup

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server Port : ${process.env.PORT || 5000}`);
    });
}).catch((error) => {
    console.log(`${error} did not connect`);
})


// try {
        
// } catch (error) {
//     res.status(500).json({ error: err.message });
// }
import express from 'express'
const app = express()
import { router as urlRoute } from './routes/url.js'
import { connectToMongoDB } from './connection.js';
import URL from './models/url.js'
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/urlshorterner")
    .then(() => console.log("MongoDB connected!"))

//Middleware
app.use(express.json())

app.use("/url", urlRoute)

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

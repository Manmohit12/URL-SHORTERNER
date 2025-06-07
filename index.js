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
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    // Find URL from DB
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        },
        { new: true }
    );

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    // Redirect
    res.redirect(entry.requiredURL); // Make sure 'requiredURL' is the correct field name
});


app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});

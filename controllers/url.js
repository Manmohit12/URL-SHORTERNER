import {nanoid} from "nanoid"
import URL from "../models/url.js"
async function handleGenerateNewShortURL(req,res){
    const shortID=nanoid(8);
    const body=req.body;
    if(!body.url) return res.status(400).json({error:'url is required'})
    await URL.create({
        shortId:shortID,
        requiredURL:body.url,
        visitHistory:[],
    })
    return res.json({id:shortID}) 
}

async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result = await URL.findOne({
        shortId
    });
    return res.json({ 
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });
}

async function handleGetShortSite(req,res){
    const shortId = req.params.shortId;

    // Find URL from DB
    // Model.findOneAndUpdate(
    //     <filter>,          // Criteria to find the document
    //         <update>,         // How to modify the document
    //             <options>         // Additional settings (optional)
    // )
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
}

export { handleGenerateNewShortURL,
    handleGetAnalytics,
    handleGetShortSite
 }

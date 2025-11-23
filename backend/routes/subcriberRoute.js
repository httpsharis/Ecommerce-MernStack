const express = require("express")
const router = express.Router();

const Subscriber = require("./../models/subscriber")

// @route POST /api/subcribe
// @desc Handler newsletter subcriber
// @access Public
router.post("/", async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(404).json({ message: "Email is required" })
    }

    try {
        // check if email already subscribed 
        let subscriber = await Subscriber.findOne({ email })

        if (subscriber) {
            res.status(400).json({ message: "Email is already subscribed" })
        }

        // Create a new subscriber
        subscriber = new Subscriber({ email })
        await subscriber.save();

        res.status(201).json({ message: "Successfully subscribed to the newsletter" })
    } catch (error) {
        cosole.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

module.exports = router;
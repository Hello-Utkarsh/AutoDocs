const prisma = require('../prisma/db')
const express = require('express')
const router = express.Router()

router.post('/post-blog', async (req, res) => {
    try {
        const { title, content, tags } = req.body
        const { token, userid } = req.headers
        if (!title || !content || !tags || !token || !userid) {
            return res.status(404).json({ message: "Please provide the mentioned details" })
        }
        const postBLog = await fetch(`https://api.medium.com/v1/users/${userid}/posts`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": title,
                "contentFormat": "markdown",
                "content": content,
                "tags": [tags],
                "publishStatus": "public"
            })
        })
        const posted = await postBLog.json()
        return res.status(200).json({posted})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
})

module.exports = router
const prisma = require('../prisma/db')
const express = require('express')
const router = express.Router()

const mediumApi = async (userid, token, title, content, tags) => {
    const req = await fetch(`https://api.medium.com/v1/users/${userid}/posts`, {
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
    return await req.json()
}

const hashnodeApi = async (token, title, subtitle, publicationId, contentMarkdown) => {
    console.log(token)
    const req = await fetch('https://gql.hashnode.com/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "query": "mutation PublishPost($input: PublishPostInput!) { publishPost(input: $input) { post { id } } }",
            "variables": {
                "input": {
                    "title": title,
                    "subtitle": subtitle,
                    "publicationId": publicationId,
                    "contentMarkdown": contentMarkdown
                }
            }
        })
    })
    return await req.json()
}


router.post('/post-blog', async (req, res) => {
    try {
        // userId is same as publicationId
        // tags are optional
        const { title, content, tags, subtitle } = req.body
        const { userid, publicationid, platforms } = req.headers
        const token = JSON.parse(req.headers.token);
        const platformsArray = Array.from(platforms.split(','))
        const postApis = {
            'medium': () => mediumApi(userid, token.medium, title.medium, content, tags),
            'hashnode': () => hashnodeApi(token.hashnode, title.hashnode, subtitle, publicationid, content)

        }
        // const queries = {'medium': `${postApis.medium}`}
        if (platformsArray.includes('medium') && (!title || !content || !token || !userid)) {
            return res.status(400).json({ message: "Please provide the mentioned details" })
        }
        if (platformsArray.includes('hashnode') && (!title || !content || !token || !publicationid)) {
            return res.status(400).json({ message: "Please provide the mentioned details" })
        }
        const posted = await Promise.all(
            platformsArray.map(async (x) => {
                const fetchedData = await postApis[x]();
                return { [x]: fetchedData };
            })
        );

        // console.log(posted[0].medium)
        // const postedRes = await posted.json()
        console.log(posted[0].hashnode)
        return res.status(200).json({ "done": "postedRes" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

module.exports = router
import fetch from 'node-fetch'
import prisma from '../prisma/db.js'
import express from 'express'
const router = express.Router()

const mediumApi = async (mediumuserid, token, title, content, tags) => {
    try {
        const req = await fetch(`https://api.medium.com/v1/users/${mediumuserid}/posts`, {
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
    } catch (error) {
        return error.message
    }
}

const devToApi = async (title, content, tags, token) => {
    try {
        const req = await fetch('https://dev.to/api/articles', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "api-key": token
            },
            body: JSON.stringify({
                "article": {
                    "title": title,
                    "published": true,
                    "body_markdown": content,
                    "tags": [tags]
                }
            }),
        })
        return await req.json()
    } catch (error) {
        return error.message
    }
}

const hashnodeApi = async (token, title, subtitle, hashnodepublicationid, contentMarkdown) => {
    console.log(subtitle)
    try {
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
                        "publicationId": hashnodepublicationid,
                        "contentMarkdown": contentMarkdown
                    }
                }
            })
        })
        return await req.json()
    } catch (error) {
        return error.message
    }
}


router.post('/post-blog', async (req, res) => {
    try {
        // userId is same as publicationId
        // tags are optional
        const { title, content, tags, subtitle } = req.body
        const { mediumuserid, hashnodepublicationid, platforms } = req.headers
        const token = JSON.parse(req.headers.token);
        const platformsArray = Array.from(platforms.split(','))
        const postApis = {
            'medium': () => mediumApi(mediumuserid, token.medium, title, content, tags),
            'hashnode': () => hashnodeApi(token.hashnode, title, subtitle, hashnodepublicationid, content),
            'dev-to': () => devToApi(title, content, tags, token['dev-to'])

        }
        if (platformsArray.includes('medium') && (!title || !content || !token.medium || !mediumuserid)) {
            return res.status(400).json({ message: "Please provide the mentioned details for medium" })
        }
        if (platformsArray.includes('hashnode') && (!title || !content || !token.hashnode || !hashnodepublicationid)) {
            return res.status(400).json({ message: "Please provide the mentioned details for hashnode" })
        }
        if (platformsArray.includes('dev-to') && (!title || !content || !token['dev-to'])) {
            return res.status(400).json({ message: "Please provide the mentioned details for daily.to" })
        }
        // looping in the platform and calling the function accordingly
        const posted = await Promise.all(
            platformsArray.map(async (x) => {
                const fetchedData = await postApis[x]();
                return { [x]: fetchedData };
            })
        );
        return res.status(200).json({ posted })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
})

export default router
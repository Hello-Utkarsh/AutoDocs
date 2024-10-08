const prisma = require('../prisma/db')
const express = require('express')
const router = express.Router()

router.get('/medium-user-data', async(req, res) => {
    try {
        const {token} = req.headers
        if (!token) {
            return res.status(401).send("Please provide the auth-token")
        }
        const userData = await await fetch(`https://api.medium.com/v1/me`, {
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
                "Accept": "application/json",
                "Accept-Charset": "utf-8",
            }
        })
        const json = await userData.json()
        return res.json({id: json.data.id})
    } catch (error) {
        return res.status(404).send(error.message)
    }
})

router.get('/get-token', async (req, res) => {
    try {
        const { id } = await req.headers
        if (!id) {
            return res.json({ message: "Please login/signin" })
        }
        const token = await prisma.user.findFirst({
            where: {
                id
            }
        })
        return res.json({ token }).status(200)
    } catch (error) {
        return res.json({ message: error.message })
    }
})

router.post('/add-token', async (req, res) => {
    try {
        const { id, tokens } = await req.body
        if (!tokens || !id) {
            return res.json({ message: "Please provide the credentials" })
        }
        const userTokens = await prisma.user.create({
            data: {
                id, tokens
            }
        })
        if (res) {
            return res.json({ userTokens }).status(200)
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
})

router.put('/update', async (req, res) => {
    try {
        const { id, tokens } = req.body
        if (!tokens || !id) {
            return res.status(400).json({ message: "Please provide the credentials" })
        }
        const userTokens = await prisma.user.update({
            where: { id },
            data: { tokens }
        })
        if (userTokens) {
            return res.status(200).json({ userTokens })
        }
    } catch (error) {
        console.log(error.status)
        return res.status(error.status).json({ message: error.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({ message: "Please provide the reuqired creds" })
        }
        const userTokens = await prisma.user.delete({
            where: { id }
        })
        if (userTokens) {
            return res.json({ message: "success" })
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
})

module.exports = router
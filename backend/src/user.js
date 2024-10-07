const prisma = require('../prisma/db')
const express = require('express')
const router = express.Router()

router.get('/get-token', async (req, res) => {
    try {
        const { id } = await req.headers
        if (!id) {
            return res.json({ message: "Please login/signin" })
        }
        const token = prisma.user.findFirst({
            where: {
                id
            }
        })
        return res.json({ message: 'success', token })
    } catch (error) {
        return res.json({ message: error.message })
    }
})

router.post('/add-token', async (req, res) => {
    try {
        const { id, name, tokens } = await req.body
        if (!tokens || !id || !name) {
            return res.json({ message: "Please provide the credentials" })
        }
        const userTokens = await prisma.user.create({
            data: {
                id, name, tokens
            }
        })
        if (res) {
            return res.json({ message: 'success', userTokens })
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
})

router.put('/update', async (req, res) => {
    try {
        const { id, tokens } = await req.body
        if (!tokens || !id) {
            return res.json({ message: "Please provide the credentials" })
        }
        const userTokens = await prisma.user.update({
            where: { id },
            data: { tokens }
        })
        if (userTokens) {
            return res.json({ message: 'success', userTokens })
        }
    } catch (error) {
        return res.json({ message: error.message })
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
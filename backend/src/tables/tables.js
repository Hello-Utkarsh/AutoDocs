import prisma from '../../prisma/db.js'
import express from 'express'
import { z } from 'zod'
const router = express.Router()

const tableCheck = z.object({
    user_id: z.string(),
    name: z.string()
})

// create tables
router.post('/create', async (req, res) => {
    const { name, user_id } = await req.body
    const parsedData = await tableCheck.safeParseAsync({ name, user_id })
    if (!parsedData.success) {
        return res.send({ message: "Invalid Data" }).status(404)
    }
    const exist_table = await prisma.tables.findFirst({
        where: { name: name }
    })
    if (exist_table) {
        return res.send({ message: "Table already exists" })
    }
    await prisma.tables.create({
        data: {
            name: name,
            user_id: user_id
        }
    })
    return res.send({ message: "success" }).status(200)
})

// fetch all user tables
router.post('/get-table', async (req, res) => {
    const { user_id } = await req.body
    if (typeof (user_id) !== "string") {
        return res.send({ message: "Invalid data" }).status(404)
    }
    const user_tables = await prisma.tables.findMany({
        where: {
            user_id: user_id
        }
    })
    return res.send({ user_tables, message: "success" }).status(200)
})

// update table
router.put('/update', async (req, res) => {
    const { table_id, name, format, content } = await req.body
    if (typeof (name) !== "string" || typeof (format) !== "string" || typeof (content) !== "string" || typeof (table_id) !== "number") {
        return res.send({ message: "Invalid Data" }).status(404)
    }
    const updated_table = await prisma.tables.update({
        where: {
            id: table_id
        },
        data: {
            name: name,
            content: content,
            formate_text: format
        }
    })

    return res.send({ message: "success", updated_table }).status(200)
})

router.delete('/delete', async (req, res) => {
    const { table_id } = await req.body
    if (typeof (table_id) !== 'number') {
        return res.send({ message: "Invalid Data" })
    }
    await prisma.docs.deleteMany({
        where: { table_id: table_id }
    })
    await prisma.tables.delete({
        where: { id: table_id }
    })
    return res.send({ message: "success" }).status(200)
})


export default router
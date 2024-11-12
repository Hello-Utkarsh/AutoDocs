import prisma from '../../prisma/db.js';
import express from 'express';
import { z } from 'zod';
const router = express.Router()

const typeDocs = z.object({
    name: z.string().optional(),
    note_id: z.number().optional(),
    content: z.string(),
    user_id: z.string(),
    publish: z.boolean(),
    table_id: z.number().optional(),
})


router.post('/create-docs', async (req, res) => {
    try {
        const { name, note_id, content, publish, table_id, user_id } = await req.body
        const parsedData = await typeDocs.safeParseAsync({ name, note_id, content, publish, table_id, user_id })
        if (!parsedData.success) {
            return res.send({ message: "Invalid Data" }).status(404)
        }
        const docs = await prisma.docs.upsert({
            where: {
                id: note_id
            },
            update: {
                content
            },
            create: {
                name,
                content,
                user_id,
                publish,
                table_id
            }
        })
        return res.send({ message: "success", docs }).status(200)
    } catch (error) {
        return res.send({ message: error.message }).status(error.status)
    }
})

router.post('/get-docs', async (req, res) => {
    try {
        const { user_id } = await req.body
        if (typeof (user_id) !== "string") {
            return res.send({ message: "Invalid Data" }).status(404)
        }
        const docs = await prisma.docs.findMany({
            where: {
                user_id: user_id
            }
        })
        return res.send({ message: "success", docs }).status(200)
    } catch (error) {
        return res.send({ message: error.message }).status(error.status)
    }
})

router.post('/get-docs-id', async (req, res) => {
    try {
        const { note_id } = await req.body
        if (typeof (note_id) !== 'number') {
            return res.send({ message: "Invalid Data" }).status(404)
        }
        const docs = await prisma.docs.findFirst({
            where: { id: note_id }
        })
        return res.send({ message: 'success', docs }).status(200)
    } catch (error) {
        return res.send({ message: error.message }).status(error.status)
    }
})

router.delete('/delete-doc/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.send("Please provide an id").status(404)
        }
        const del_doc = await prisma.docs.delete({
            where: {
                id: Number(id)
            }
        })
        if (del_doc) {
            return res.json({ message: 'success', id: del_doc.id })
        }
        return res.send("Please try again").status(404)
    } catch (error) {
        return res.send(error.message)
    }
})

export default router
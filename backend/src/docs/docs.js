import prisma from '../../prisma/db.js';  // Ensure to include .js
import express from 'express';
// import { route } from '../tables/tables.js';  // Ensure to include .js
// import { number } from 'zod';
import { z } from 'zod';  // Destructure z from zod
const router = express.Router()

const typeDocs = z.object({
    name: z.string(),
    content: z.string(),
    user_id: z.string(),
    publish: z.boolean(),
    table_id: z.number(),
})


router.post('/create-docs', async (req, res) => {
    try {
        const { name, content, publish, table_id, user_id } = await req.body
        const parsedData = await typeDocs.safeParseAsync({ name, content, publish, table_id, user_id })
        if (!parsedData.success) {
            return res.send({ message: "Invalid Data" }).status(404)
        }
        const docs = await prisma.docs.create({
            data: {
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

export default router
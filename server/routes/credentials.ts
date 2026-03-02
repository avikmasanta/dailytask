import express from 'express';
import { getDb } from '../db';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Store user login credentials (per user request)
router.post('/store', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const db = await getDb();

        const result = await db.collection('user_credentials').insertOne({
            email,
            password,
            timestamp: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Credentials stored',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error storing credentials:', error);
        res.status(500).json({ error: 'Failed to store credentials' });
    }
});

export default router;

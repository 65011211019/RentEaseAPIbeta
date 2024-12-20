const express = require('express');
const router = express.Router();
const db = require('../db'); // ใช้ Pool จาก db.js

// Create a new user (POST)
router.post('/user', async (req, res) => {
    const { user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified } = req.body;

    if (!user_name || !user_email || !user_pass) {
        return res.status(400).json({ error: 'Missing required fields: user_name, user_email, or user_pass' });
    }

    const query = `
        INSERT INTO user (user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [results] = await db.query(query, [user_name, user_email, user_pass, user_imgurl || null, user_birthday || null, user_numberphone || null, user_verified || false]);
        res.status(201).json({ message: 'User created successfully', userId: results.insertId });
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to insert user into the database' });
    }
});

// Get all users (GET)
router.get('/users', async (req, res) => {
    const query = 'SELECT * FROM user';

    try {
        const [results] = await db.query(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users from the database' });
    }
});

// Get a user by ID (GET)
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM user WHERE user_id = ?';

    try {
        const [results] = await db.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user from the database' });
    }
});

// Update user information (PUT)
router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified } = req.body;

    const query = `
        UPDATE user 
        SET user_name = ?, user_email = ?, user_pass = ?, user_imgurl = ?, user_birthday = ?, user_numberphone = ?, user_verified = ?
        WHERE user_id = ?
    `;

    try {
        const [results] = await db.query(query, [user_name || null, user_email || null, user_pass || null, user_imgurl || null, user_birthday || null, user_numberphone || null, user_verified || false, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user in the database' });
    }
});

// Delete a user (DELETE)
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM user WHERE user_id = ?';

    try {
        const [results] = await db.query(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user from the database' });
    }
});

module.exports = router;

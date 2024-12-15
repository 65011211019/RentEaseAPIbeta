const express = require('express');
const router = express.Router();
const db = require('../db'); // อ้างอิงการเชื่อมต่อจาก db.js



// Create a new user (POST)
router.post('/user', (req, res) => {
    const { user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified } = req.body;

    if (!user_name || !user_email || !user_pass) {
        return res.status(400).json({ error: 'Missing required fields: user_name, user_email, or user_pass' });
    }

    const query = `
        INSERT INTO user (user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [user_name, user_email, user_pass, user_imgurl || null, user_birthday || null, user_numberphone || null, user_verified || false], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Failed to insert user into the database' });
        }
        res.status(201).json({ message: 'User created successfully', userId: results.insertId });
    });
});

// Get all users (GET)
router.get('/users', (req, res) => {
    const query = 'SELECT * FROM user';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users from the database' });
        }
        res.status(200).json(results);
    });
});

// Get a user by ID (GET)
router.get('/user/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM user WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user from the database' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Update user information (PUT)
router.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { user_name, user_email, user_pass, user_imgurl, user_birthday, user_numberphone, user_verified } = req.body;

    const query = `
        UPDATE user 
        SET user_name = ?, user_email = ?, user_pass = ?, user_imgurl = ?, user_birthday = ?, user_numberphone = ?, user_verified = ?
        WHERE user_id = ?
    `;

    db.query(query, [user_name || null, user_email || null, user_pass || null, user_imgurl || null, user_birthday || null, user_numberphone || null, user_verified || false, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user in the database' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete a user (DELETE)
router.delete('/user/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM user WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user from the database' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

module.exports = router;

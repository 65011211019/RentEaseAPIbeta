const express = require('express');
const router = express.Router();
const db = require('../db'); // ใช้การเชื่อมต่อฐานข้อมูลจาก db.js

// Create a new category (POST)
router.post('/category', async (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const [results] = await db.query(
            `INSERT INTO category_product (category_name) VALUES (?)`,
            [category_name]
        );
        res.status(201).json({ message: 'Category created successfully', categoryId: results.insertId });
    } catch (err) {
        console.error('Error inserting category:', err);
        res.status(500).json({ error: 'Failed to insert category into the database' });
    }
});

// Get all categories (GET)
router.get('/categories', async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM category_product`);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories from the database' });
    }
});

// Get a category by ID (GET)
router.get('/category/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(
            `SELECT * FROM category_product WHERE category_id = ?`,
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ error: 'Failed to fetch category from the database' });
    }
});

// Update a category (PUT)
router.put('/category/:id', async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const [results] = await db.query(
            `UPDATE category_product SET category_name = ? WHERE category_id = ?`,
            [category_name, id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category in the database' });
    }
});

// Delete a category (DELETE)
router.delete('/category/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(
            `DELETE FROM category_product WHERE category_id = ?`,
            [id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category from the database' });
    }
});

module.exports = router;

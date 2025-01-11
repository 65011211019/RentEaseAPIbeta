const express = require('express');
const router = express.Router();
const db = require('../db'); // ใช้การเชื่อมต่อฐานข้อมูลจาก db.js

// Helper function to validate numbers and booleans
const isValidNumber = (value) => !isNaN(value) && value > 0;
const isValidBoolean = (value) => value === 0 || value === 1;

// Create a new product (POST)
router.post('/product', async (req, res) => {
    const {
        product_name,
        product_desc,
        product_price,
        product_available,
        stock,
        user_id,
        category_id
    } = req.body;

    // Validate required fields
    if (!product_name || !product_price || !product_available || !stock || !user_id || !category_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure price, stock, and availability are valid
    if (!isValidNumber(product_price) || !isValidNumber(stock) || !isValidBoolean(product_available)) {
        return res.status(400).json({ error: 'Product price, stock, and availability must be valid positive numbers/boolean' });
    }

    try {
        const [results] = await db.query(  // Use `db.query` instead of `db.promise().query`
            `INSERT INTO product (product_name, product_desc, product_price, product_available, stock, user_id, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [product_name, product_desc || null, product_price, product_available, stock, user_id, category_id]
        );
        res.status(201).json({ message: 'Product created successfully', productId: results.insertId });
    } catch (err) {
        console.error('Error inserting product:', err);
        res.status(500).json({ error: 'Failed to insert product into the database' });
    }
});

// Get all products (GET)
router.get('/products', async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM product`);  // Use `db.query`
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products from the database' });
    }
});

// Get a product by ID (GET)
router.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const [results] = await db.query(  // Use `db.query`
            `SELECT * FROM product WHERE product_id = ?`,
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Failed to fetch product from the database' });
    }
});

// Update a product (PUT)
router.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const {
        product_name,
        product_desc,
        product_price,
        product_available,
        stock,
        user_id,
        category_id
    } = req.body;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Ensure price, stock, and availability are valid
    if (!isValidNumber(product_price) || !isValidNumber(stock) || !isValidBoolean(product_available)) {
        return res.status(400).json({ error: 'Product price, stock, and availability must be valid positive numbers/boolean' });
    }

    try {
        const [results] = await db.query(  // Use `db.query`
            `UPDATE product
            SET product_name = ?, product_desc = ?, product_price = ?, product_available = ?, stock = ?, user_id = ?, category_id = ?
            WHERE product_id = ?`,
            [product_name, product_desc, product_price, product_available, stock, user_id, category_id, id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Failed to update product in the database' });
    }
});

// Delete a product (DELETE)
router.delete('/product/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const [results] = await db.query(  // Use `db.query`
            `DELETE FROM product WHERE product_id = ?`,
            [id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product from the database' });
    }
});

// Get all products for a specific user (GET)
router.get('/products/user_id/:user_id', async (req, res) => {
    const { user_id } = req.params;

    // Ensure user_id is a valid number
    if (!isValidNumber(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const [results] = await db.query(  // Use `db.query`
            `SELECT * FROM product WHERE user_id = ?`,
            [user_id]
        );
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products for user:', err);
        res.status(500).json({ error: 'Failed to fetch products for this user from the database' });
    }
});



module.exports = router;

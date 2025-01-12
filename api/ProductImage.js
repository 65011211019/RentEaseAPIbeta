const express = require('express');
const router = express.Router();
const db = require('../db');  // ใช้การเชื่อมต่อฐานข้อมูลจาก db.js

// Helper function to validate numbers
const isValidNumber = (value) => !isNaN(value) && value > 0;

// Create a new product image (POST)
router.post('/productimage', async (req, res) => {  // ใช้ '/' เพื่อให้เส้นทางตรงกับ /api/product-image
    const { product_image_url, product_id } = req.body;

    // Validate required fields
    if (!product_image_url || !product_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure product_id is valid
    if (!isValidNumber(product_id)) {
        return res.status(400).json({ error: 'Invalid product_id' });
    }

    try {
        const [results] = await db.query(
            `INSERT INTO product_image (product_image_url, product_id) VALUES (?, ?)`,
            [product_image_url, product_id]
        );
        res.status(201).json({ message: 'Product image created successfully', productImageId: results.insertId });
    } catch (err) {
        console.error('Error inserting product image:', err);
        res.status(500).json({ error: 'Failed to insert product image into the database' });
    }
});

// Get all product images (GET)
router.get('/productimages', async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM product_image`);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching product images:', err);
        res.status(500).json({ error: 'Failed to fetch product images from the database' });
    }
});

// Get a product image by ID (GET)
router.get('/productimage/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product image ID' });
    }

    try {
        const [results] = await db.query(
            `SELECT * FROM product_image WHERE product_image_id = ?`,
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product image not found' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching product image:', err);
        res.status(500).json({ error: 'Failed to fetch product image from the database' });
    }
});

// Update a product image (PUT)
router.put('/productimage/:id', async (req, res) => {
    const { id } = req.params;
    const { product_image_url, product_id } = req.body;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product image ID' });
    }

    // Ensure product_id is valid
    if (!isValidNumber(product_id)) {
        return res.status(400).json({ error: 'Invalid product_id' });
    }

    try {
        const [results] = await db.query(
            `UPDATE product_image
            SET product_image_url = ?, product_id = ?
            WHERE product_image_id = ?`,
            [product_image_url, product_id, id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product image not found' });
        }
        res.status(200).json({ message: 'Product image updated successfully' });
    } catch (err) {
        console.error('Error updating product image:', err);
        res.status(500).json({ error: 'Failed to update product image in the database' });
    }
});

// Delete a product image (DELETE)
router.delete('/productimage/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure ID is a valid number
    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product image ID' });
    }

    try {
        const [results] = await db.query(
            `DELETE FROM product_image WHERE product_image_id = ?`,
            [id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product image not found' });
        }
        res.status(200).json({ message: 'Product image deleted successfully' });
    } catch (err) {
        console.error('Error deleting product image:', err);
        res.status(500).json({ error: 'Failed to delete product image from the database' });
    }
});

router.delete('/productimage/product/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidNumber(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const [results] = await db.query(
            `DELETE FROM product_image WHERE product_id = ?`,
            [id]
        );
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No product images found for this product' });
        }
        res.status(200).json({ message: 'All product images for the product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product images by product ID:', err);
        res.status(500).json({ error: 'Failed to delete product images from the database' });
    }
});

module.exports = router;

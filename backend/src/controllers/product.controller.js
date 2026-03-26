const prisma = require('../config/prisma.js')

// CALCULATE AVAILABLE STOCK
const calculateAvailableStock = (product) => {
    const sold = product.orderItems.reduce((sum, item) => {
        return sum + item.quantity
    }, 0)

    return product.stock - sold
}

// GET ALL
async function getProducts(req, res) {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                orderItems: {
                    where: {
                        order: {
                            status: { not: "CANCELLED" }
                        }
                    }
                }
            }
        })

        const result = products.map(p => ({
            ...p,
            availableStock: calculateAvailableStock(p)
        }))

        res.json(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// CREATE
async function createProduct(req, res) {
    try {
        const { name, description, price, stock, imageUrl, categoryId } = req.body

        if (!name || !price || !categoryId) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                categoryId: Number(categoryId)
            }
        })

        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET BY ID
async function getProductById(req, res) {
    try {
        const id = parseInt(req.params.id)

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                orderItems: {
                    where: {
                        order: {
                            status: { not: "CANCELLED" }
                        }
                    }
                }
            }
        })

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const availableStock = calculateAvailableStock(product)

        res.json({
            ...product,
            availableStock
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// UPDATE
async function updateProduct(req, res) {
    try {
        const id = parseInt(req.params.id)
        const { name, description, price, stock, imageUrl, categoryId } = req.body

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                categoryId: Number(categoryId)
            }
        })

        res.json(product)
    } catch (err) {
        res.status(500).json({
            message: "Update failed",
            error: err.message
        })
    }
}

// DELETE
async function deleteProduct(req, res) {
    try {
        const id = parseInt(req.params.id)

        await prisma.cartItem.deleteMany({
            where: { productId: id }
        })

        await prisma.orderItem.deleteMany({
            where: { productId: id }
        })

        await prisma.review.deleteMany({
            where: { productId: id }
        })

        const product = await prisma.product.delete({
            where: { id }
        })

        res.json({
            message: "Product deleted",
            product
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: "Delete failed",
            error: err.message
        })
    }
}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}
const prisma = require("../config/prisma")
const { get } = require("../routes/auth.routes")

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { userId, totalPrice, address, phone, items } = req.body

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" })
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const productId = item.productId
        const qty = item.quantity

        const product = await tx.product.findUnique({
          where: { id: productId }
        })

        if (!product) {
          throw new Error("Product not found")
        }

        const sold = await tx.orderItem.aggregate({
          _sum: { quantity: true },
          where: {
            productId,
            order: {
              status: { not: "CANCELLED" }
            }
          }
        })

        const soldQty = sold._sum.quantity || 0
        const available = product.stock - soldQty

        if (qty > available) {
          throw new Error(`สินค้า ${product.name} เหลือแค่ ${available} ชิ้น`)
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          address,
          phone,
          status: "PENDING",
          items: {
            create: items
          }
        }
      })

      return newOrder
    })

    res.json(order)

  } catch (err) {
    console.error(err)
    res.status(400).json({
      message: err.message || "Create order failed"
    })
  }
}


// GET ORDERS
const getOrders = async (req, res) => {
  const userId = Number(req.params.userId)

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      },
      payment: true
    }
  })

  res.json(orders)
}


//  GET ORDER BY ID
const getOrderById = async (req, res) => {
  const id = Number(req.params.id)

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      payment: true
    }
  })

  res.json(order)
}
// GET ALL ORDERS (ADMIN)
const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: { product: true }
      },
      payment: true
    }
  })

  res.json(orders)
}

//  DELETE ORDER
const deleteOrder = async (req, res) => {
  const id = Number(req.params.id)

  try {
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    })

    await prisma.payment.deleteMany({
      where: { orderId: id }
    })

    await prisma.order.delete({
      where: { id }
    })

    res.json({ message: "Order deleted" })

  } catch (err) {
    res.status(500).json({ error: "Delete failed" })
  }
}


//  EXPORT
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  getAllOrders
}
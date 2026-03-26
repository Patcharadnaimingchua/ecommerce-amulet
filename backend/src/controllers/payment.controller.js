const prisma = require('../config/prisma')

async function createPayment(req, res) {

  try {

    const userId = req.user.userId
    const { orderId, method } = req.body

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    if (order.status === "PAID") {
      return res.status(400).json({ message: "Already paid" })
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: order.totalPrice,
        method,
        status: "PAID"
      }
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" }
    })

    res.json({
      message: "Payment success",
      payment
    })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

}

module.exports = { createPayment }
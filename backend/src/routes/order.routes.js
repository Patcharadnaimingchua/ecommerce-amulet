const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')

router.post('/', orderController.createOrder)
router.get('/detail/:id', orderController.getOrderById) 
router.get('/:userId', orderController.getOrders)
router.delete('/:id', orderController.deleteOrder)
router.get('/', orderController.getAllOrders)

module.exports = router
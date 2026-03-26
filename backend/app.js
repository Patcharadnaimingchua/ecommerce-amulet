require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://patcharadnaimingchua.github.io",
    "https://e-commerce-jet-two-95.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./src/routes/auth.routes');
const cartRoutes = require('./src/routes/cart.routes');
const categoryRoutes = require('./src/routes/category.routes');
const orderRoutes = require('./src/routes/order.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const productRoutes = require('./src/routes/product.routes');
const reviewRoutes = require('./src/routes/review.routes');

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

app.get("/", (req, res) => {
    res.send("Ecommerce API running");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
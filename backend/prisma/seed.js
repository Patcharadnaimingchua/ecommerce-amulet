require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    const category = await prisma.category.upsert({
        where: { name: "Electronics" },
        update: {},
        create: {
            name: "Electronics"
        }
    });


    await prisma.product.createMany({
        data: [
            {
                name: "iPhone 15",
                description: "Smartphone รุ่นใหม่ล่าสุด",
                price: 35000,
                stock: 10,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "MacBook Air M2",
                description: "Laptop บางเบาแรง",
                price: 45000,
                stock: 5,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "iPad Pro",
                description: "Tablet ระดับโปร",
                price: 32000,
                stock: 8,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "AirPods Pro",
                description: "หูฟังไร้สายคุณภาพสูง",
                price: 9000,
                stock: 15,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "Apple Watch",
                description: "สมาร์ทวอทช์สุดล้ำ",
                price: 15000,
                stock: 12,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "Samsung Galaxy S23",
                description: "Android flagship",
                price: 30000,
                stock: 7,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "Gaming Laptop",
                description: "โน้ตบุ๊คสำหรับเล่นเกม",
                price: 55000,
                stock: 4,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "Mechanical Keyboard",
                description: "คีย์บอร์ด mechanical",
                price: 3500,
                stock: 20,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "Wireless Mouse",
                description: "เมาส์ไร้สายใช้งานง่าย",
                price: 1200,
                stock: 25,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            },
            {
                name: "4K Monitor",
                description: "จอคอมความละเอียดสูง",
                price: 12000,
                stock: 6,
                imageUrl: "https://via.placeholder.com/300",
                categoryId: category.id
            }
        ]
    });

    console.log("✅ Seed data added!");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
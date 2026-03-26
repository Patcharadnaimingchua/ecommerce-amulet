const prisma = require('../config/prisma')

async function getCategories(req, res) {
  const categories = await prisma.category.findMany()
  res.json(categories)
}

async function createCategory(req, res) {
  const { name } = req.body

  const category = await prisma.category.create({
    data: { name }
  })

  res.json(category)
}

async function deleteCategory(req,res){
  const{id} = req.params
  try{
    const category = await prisma.category.delete({
      where:{id: Number(id)}
    })
    res.json({ message: "Category deleted" })
  }catch(err){
    res.status(500).json({ message: "Delete failed" })
  }
}
  module.exports = {
    getCategories,
    createCategory,
    deleteCategory
  }
const {Product} = require('../db/models');

exports.getProducts = async (req, res) => {
    try{
        const getAll =  await Product.findAll()
        res.status(200).json({success: true, data: getAll})
    } catch(err){
        res.status(500).json({success:false, message: err})
    }
};
exports.getProduct = async (req, res) => {
    try{
        const id = req.params.id
        const getOne = await Product.findByPk(id)
        if(!id){
            res.status(404).json({success: false, message: 'Product not found'})
        }
        res.status(200).json({success: true, data: getOne})
    } catch(err){
        res.status(500).json({success:false, message: err})
    }
};
exports.createProduct = async (req, res) => {
    try{
        const fields = req.body
        const create = await Product.create(fields)
        if(!fields){
            res.status(404).json({success: false, messsage: 'fields is required'})
        }
        res.status(200).json({success: true, data: create})
    } catch(err){
        res.status(500).json({success:false, message: err})
    }
};
exports.updateProduct = async (req, res) => {
    try{
        const id = req.params.id
        const {name, price, img} = req.body
        const validate = await Product.findByPk(id)
        if(!validate){
        res.status(400).json({success:false, message: "Product not found"})
        }
         await Product.update({name, price, img}, {where:{id}})
        res.status(200).json({success: true, message: 'Product updated'})
    } catch(err){
        res.status(500).json({success:false, message: err})
    }
};
exports.deleteProduct = async (req, res) => {
    try{
        const id = req.params.id
        const destroy = await Product.destroy({where: {id}})
         if(!destroy){
            res.status(404).json({success: false, message: 'Product not found'})
        }
        res.status(200).json({success: true, message: 'Product deleted!'})
    } catch(err){
        res.status(500).json({success:false, message: err})
    }
};

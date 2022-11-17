// import express from 'express';
const express=require("express")
// import { getItems,createItem } from '../controllers/item.js';
const getItems=require('../controllers/item')
// const createItem=require('../controllers/item.js')

const router = express.Router();


router.get('/',getItems.getItems)
router.post('/',getItems.createItem);
module.exports = router;

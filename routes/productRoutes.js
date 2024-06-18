const express = require("express");
const router = express.Router();

// Dummy product data with images
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    description: "Description for product 1",
    imageUrl: "images/product1.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    description: "Description for product 2",
    imageUrl: "images/product2.jpg",
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    description: "Description for product 3",
    imageUrl: "images/product3.jpg",
  },
  {
    id: 4,
    name: "Product 4",
    price: 150,
    description: "Description for product 4",
    imageUrl: "images/product4.jpg",
  },
  {
    id: 5,
    name: "Product 5",
    price: 250,
    description: "Description for product 5",
    imageUrl: "images/product5.jpg",
  },
  {
    id: 6,
    name: "Product 6",
    price: 350,
    description: "Description for product 6",
    imageUrl: "images/product6.jpg",
  },
  {
    id: 7,
    name: "Product 7",
    price: 450,
    description: "Description for product 7",
    imageUrl: "images/product7.jpg",
  },
  {
    id: 8,
    name: "Product 8",
    price: 550,
    description: "Description for product 8",
    imageUrl: "images/product8.jpg",
  },
  {
    id: 9,
    name: "Product 9",
    price: 650,
    description: "Description for product 9",
    imageUrl: "images/product9.jpg",
  },
  {
    id: 10,
    name: "Product 10",
    price: 750,
    description: "Description for product 10",
    imageUrl: "images/product10.jpg",
  },
  {
    id: 11,
    name: "Product 11",
    price: 850,
    description: "Description for product 11",
    imageUrl: "images/product11.jpg",
  },
  {
    id: 12,
    name: "Product 12",
    price: 950,
    description: "Description for product 12",
    imageUrl: "images/product12.jpg",
  },
];

// GET /api/products - Get all products
router.get("/", (req, res) => {
  res.json(products);
});

module.exports = router;

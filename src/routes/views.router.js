import { Router } from "express";
import ProductModel from "../models/products.model.js";
import authMiddleware from "../middleware/auth.js"; 

const router = Router();

// RUTA raíz: Obtener todos los productos y renderizarlos en la vista 'home'
router.get("/products", authMiddleware(['user', 'admin']), async (req, res) => {
    try {
        const productos = await ProductModel.find().lean(); // Consultar todos los productos de MongoDB
        res.render('home', { products: productos, user: req.user }); // Renderizar la vista con los productos obtenidos
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).send('Error al cargar los productos');
    }
});

// RUTA para la vista real-time products con Socket.io
router.get('/realtimeproducts', authMiddleware(['admin']), async (req, res) => {
    try {
        const productos = await ProductModel.find().lean(); // Consultar todos los productos de MongoDB
        res.render('realTimeProducts', { products: productos, user: req.user }); // Renderizar la vista con los productos obtenidos
    } catch (error) {
        console.error('Error al cargar productos en tiempo real:', error.message);
        res.status(500).send("Error al obtener los productos en tiempo real");
    }
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    try {
      if (req.user) {
        return res.redirect('/products'); // Redirigir a productos si ya está autenticado
      }
      res.render('login'); // Renderizar la vista de login
    } catch (error) {
      console.error('Error al mostrar el login:', error.message);
      res.status(500).send('Error al cargar la página de login');
    }
  });
  
export default router;

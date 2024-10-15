import { Router } from "express";
import mongoose from "mongoose";
import CartManager from "../controllers/cart-manager.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();
const cartManager = new CartManager();

router.post('/', authMiddleware(['user']), async (req, res) => {
    try {
      const nuevoCarrito = await cartManager.createCart();
      res.status(201).json(nuevoCarrito);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
    }
  });

  router.get('/:cid', authMiddleware(['user']), async (req, res) => {
    try {
      const { cid } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ message: 'ID de carrito no válido' });
      }
  
      const carrito = await cartManager.findCartById(cid);
      if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      res.json(carrito);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
  });

router.post('/:cid/product/:pid', authMiddleware(['user']), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
          return res.status(400).json({ message: 'ID de carrito o producto no válido' });
        }
    
        const resultado = await cartManager.addProductToCart(cid, pid, quantity);
        if (!resultado) {
          return res.status(404).json({ message: 'Carrito o producto no encontrado' });
        }
        res.status(201).json({ message: 'Producto agregado al carrito' });
      } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
      }
    });

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const productosActualizados = req.body.products;
    
        if (!mongoose.Types.ObjectId.isValid(cid)) {
          return res.status(400).json({ message: 'ID de carrito no válido' });
        }
    
        const carritoActualizado = await cartManager.updateCart(cid, productosActualizados);
        if (!carritoActualizado) {
          return res.status(404).json({ message: 'Carrito no encontrado' });
        }
    
        res.status(200).json({ message: 'Carrito actualizado', carrito: carritoActualizado });
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error: error.message });
      }
    });

// Actualizar la cantidad de un producto en el carrito 
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
          return res.status(400).json({ message: 'ID de carrito o producto no válido' });
        }
    
        const productoActualizado = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (!productoActualizado) {
          return res.status(404).json({ message: 'Producto o carrito no encontrado' });
        }
    
        res.status(200).json({ message: `Cantidad del producto ${pid} actualizada a ${quantity}` });
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error: error.message });
      }
    });

router.delete('/:cid/products/:pid', authMiddleware(['user']), async (req, res) => {
    const { cid, pid } = req.params;

    // Validar ObjectIds
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto no válido" });
    }

    try {
        const resultado = await cartManager.removeProductFromCart(cid, pid);
        if (resultado) {
            res.status(200).send(`Producto ${pid} eliminado del carrito ${cid}`);
        } else {
            res.status(404).send("Carrito o producto no encontrado");
        }
    } catch (error) {
        console.log(`Error al intentar eliminar el producto ${pid} del carrito ${cid}:`, error.message);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:cid', authMiddleware(['user']), async (req, res) => {
    const { cid } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito no válido" });
    }

    try {
        const resultado = await cartManager.clearCart(cid);
        if (resultado) {
            res.status(200).send(`Todos los productos del carrito ${cid} han sido eliminados`);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

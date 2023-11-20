import express from 'express';
import fs from 'fs/promises';

const router = express.Router();
const cartsFilePath = './data/carrito.json';

// Agregar carrito nuevo 

router.post('/', async (req, res) => {
  try {
    const newCart = {
      id: generateCartId(),
      products: []
    };

    const carts = await readCartsFile();
    carts.push(newCart);

    await writeCartsFile(carts);
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear un nuevo carrito');
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carts = await readCartsFile();
    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el carrito');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    let carts = await readCartsFile();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const existingProductIndex = carts[cartIndex].products.findIndex((p) => p.id === productId);

      if (existingProductIndex !== -1) {
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push({ id: productId, quantity });
      }

      await writeCartsFile(carts);
      res.send(`Producto con ID ${productId} agregado al carrito con ID ${cartId}`);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

// Funciones de ayuda
async function readCartsFile() {
  const data = await fs.readFile(cartsFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeCartsFile(carts) {
  await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
}

function generateCartId() {
  return Date.now().toString();
}

export default router;

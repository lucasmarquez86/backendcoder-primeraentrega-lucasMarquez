import express from 'express';
import fs from 'fs/promises';

const router = express.Router();
const productsFilePath = './data/productos.json';

// GET Products Limit
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await readProductsFile();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});
  
// Endpoint para obtener un producto por ID

router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const products = await readProductsFile();
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});

// Agregar producto nuevo 

router.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    newProduct.id = generateProductId();
    const products = await readProductsFile();
    products.push(newProduct);
    await writeProductsFile(products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear un nuevo producto');
  }
});

// Modificar producto
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;

  try {
    let products = await readProductsFile();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      await writeProductsFile(products);
      res.send(`Producto con ID ${productId} actualizado`);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el producto');
  }
});

router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    let products = await readProductsFile();
    products = products.filter((p) => p.id !== productId);
    await writeProductsFile(products);
    res.send(`Producto con ID ${productId} eliminado`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

// Funciones de ayuda
async function readProductsFile() {
  const data = await fs.readFile(productsFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeProductsFile(products) {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

function generateProductId() {
  return Date.now().toString();
}

export default router;

// server.js
import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

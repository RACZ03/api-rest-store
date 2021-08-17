import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import { createRoles } from './helpers/initialSetup';

// Imports routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import discountRoutes from './routes/discount.routes';
import productRoutes from './routes/product.routes';

const app = express();
createRoles();

// save a variable in express
app.set('pkg', pkg);

app.use(morgan('dev'));
// receive json files
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    });
});

app.use('/api/auth', authRoutes );
app.use('/api/user', userRoutes );
app.use('/api/discount', discountRoutes );
app.use('/api/product', productRoutes);

export default app;
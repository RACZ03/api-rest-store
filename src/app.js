import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import { createRoles } from './libs/initialSetup';

// Imports routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

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

export default app;
 
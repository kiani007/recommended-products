import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import scheduleProductUpdate from './utils/cronJob.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Swagger setup
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Product Recommendation API',
        version: '1.0.0',
        description: 'API documentation for product recommendation service',
      },
    },
    apis: ['./routes/*.js'],
  };
  
  const swaggerSpec = swaggerJsdoc(options);
  
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
// Body parser middleware
app.use(express.json());
app.use('/api/v1/products', productRoutes);

// Start the cron job
scheduleProductUpdate();

export default app;


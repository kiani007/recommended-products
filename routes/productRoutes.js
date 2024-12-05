import express from 'express';
import { processProducts } from '../controllers/productController.js';
import {verifyProduct} from '../controllers/verifyProductController.js'
const router = express.Router();

/**
 * @swagger
 * /api/v1/products/process-products:
 *   get:
 *     summary: Fetch list of products
 *     description: Fetches active products from the Shopify store.
 *     responses:
 *       200:
 *         description: List of active products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   metafields:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         key:
 *                           type: string
 *                         value:
 *                           type: string
 */

router.get('/process-products', processProducts);


router.get('/verify-products', verifyProduct);

export default router;

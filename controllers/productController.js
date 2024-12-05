import { fetchProducts, mapRelatedProducts, updateProductWithRelatedProducts } from '../services/productService.js';

export const processProducts = async (req, res) => {

  try {
    const products = await fetchProducts();
    const relatedProductsData = await mapRelatedProducts(products);

    for (const { productId, relatedProductId } of relatedProductsData) {
      if (relatedProductId.length > 0) {
        await updateProductWithRelatedProducts(productId, relatedProductId);
      }
    }
    
    res.status(200).json({ message: 'Products processed and updated successfully.' });
  } catch (error) {
    console.error('Error in processing products:', error);
    res.status(500).json({ error: 'An error occurred while processing products.' });
  }
};

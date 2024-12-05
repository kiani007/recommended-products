import gql from 'graphql-tag';
import client from '../config/graphqlClient.js';

export const fetchProducts = async () => {
  const query = gql`
    query FetchProductsWithMetafields {
      products(first: 10, query: "status:active") {
        edges {
          node {
            id
            title
            metafields(namespace: "masterdata", first: 1) {
              edges {
                node {
                  key
                  value
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  metafields(namespace: "masterdata", first: 2) {
                    edges {
                      node {
                        key
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const response = await client.request(query);
    return response.products.edges;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const mapRelatedProducts = async (products) => {
  const relatedProducts = [];

  for (const product of products) {
    const variants = product.node.variants.edges;

    for (const variant of variants) {
      const metafields = variant.node.metafields.edges;

      const typeNoMetafield = metafields.find((mf) => mf.node.key === 'type_no');
      const edpNumberMetafield = metafields.find((mf) => mf.node.key === 'edpNumber');

      if (typeNoMetafield && edpNumberMetafield) {
        const typeno = typeNoMetafield.node.value;
        const edpNumber = edpNumberMetafield.node.value;
        const relatedProduct = await fetchRelatedProduct(typeno, edpNumber, products, product.node.id);

        if (relatedProduct) {
          relatedProducts.push({
            productId: product.node.id,
            relatedProductId: relatedProduct,
          });
        }
      }
    }
  }
  return relatedProducts;
};

export const fetchRelatedProduct = async (typeno, edpNumber, allProducts, prodId) => {
  const relatedProdsArr = [];
  for (const product of allProducts) {
    for (const variant of product.node.variants.edges) {
      const metafields = variant.node.metafields.edges;
      const typeNoMetafield = metafields.find((mf) => mf.node.key === 'type_no');
      const edpNumberMetafield = metafields.find((mf) => mf.node.key === 'edpNumber');
      const productId = product.node.id;

      if (
        typeNoMetafield?.node.value === typeno &&
        edpNumberMetafield?.node.value === edpNumber &&
        prodId !== productId
      ) {
        relatedProdsArr.push(productId);
      }
    }
  }
  return relatedProdsArr;
};

export const updateProductWithRelatedProducts = async (productId, relatedProductIds) => {
  const mutation = gql`
    mutation UpdateProductMetafield($productId: ID!, $relatedProductIds: String!) {
      productUpdate(
        input: {
          id: $productId,
          metafields: [
            {
              namespace: "recommendations",
              key: "related_products",
              value: $relatedProductIds,
              type: "json"
            }
          ]
        }
      ) {
        product {
          id
          metafields(first: 5) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    }
  `;

  try {
    const variables = {
      productId,
      relatedProductIds: JSON.stringify(relatedProductIds),
    };
    await client.request(mutation, variables);
    console.log(`Product ${productId} updated successfully.`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

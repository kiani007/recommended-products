import gql from 'graphql-tag';
import client from '../config/graphqlClient.js';
export async function verifyProductUpdate() {
    const query = `
            query FetchFirst10UpdatedProducts {
            products(first: 10,query:"status:active") {
            edges {
                node {
                id
                title
                metafields(namespace: "recommendations", first: 1) {
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
    `;
    try {
        const response = await client.request(query);
        console.log('Fetched Products:',JSON.stringify(response.products, null, 2));
        return JSON.stringify(response.products, null, 2)

    } catch (error) {
        console.error('Error fetching product metafields:', error);
    }
  }
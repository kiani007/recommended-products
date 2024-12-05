import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const shopifyStoreUrl = process.env.SHOPIFY_STORE_URL;
const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;

const client = new GraphQLClient(`${shopifyStoreUrl}/admin/api/2023-10/graphql.json`, {
  headers: {
    'X-Shopify-Access-Token': shopifyAccessToken,
    'Content-Type': 'application/json',
  },
});

export default client;

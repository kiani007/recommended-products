import cron from 'node-cron';

const scheduleProductUpdate = () => {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running scheduled product update...');
    const response = await fetch('http://localhost:5000/api/v1/products/process-products', { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Error running scheduled product update: ${response.statusText}`);
    }
  });
};

export default scheduleProductUpdate;

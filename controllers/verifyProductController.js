import { verifyProductUpdate } from "../services/verifyProductService.js"


export const verifyProduct = async(req,res)=>{
    try{
        const products = await verifyProductUpdate();
        return res.status(200).json({"products": products})

    }catch(error){  
        console.error('Error in processing products:', error);
        res.status(500).json({ error: 'An error occurred while processing products.' });
    }
}
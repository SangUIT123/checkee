import dbConnect from '@/utils/dbConnect';
import User, { CustomerDocument } from '@/models/User';
import type { CustomerHandlers } from 'Backend/api/customer/indexId';

// Return all employees info
const getCustomerById: CustomerHandlers['getCustomerById'] = async ({
  res,
  req,
  body,
  // config,
}) => {
    await dbConnect();
    let result: { data?: CustomerDocument } = {}
    try{
        result.data = await User.findById(req.query.id)
        if(!result.data){
            return res.status(400).json({
                data : null,
                errors:[{message:"không tìm thấy SystemPage"}]
            })
        }else{
            return res.status(200).json({
                data:result.data,
            })
        }
    }catch(error){
        return res.status(500).json({
            data:null,
            errors:[{message:error.message}]
        })
    }
}


export default getCustomerById
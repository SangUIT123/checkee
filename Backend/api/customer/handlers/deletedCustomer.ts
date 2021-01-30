import dbConnect from '@/utils/dbConnect';
import User, { CustomerDocument } from '@/models/User';
import type { CustomerHandlers } from 'Backend/api/customer/indexId';

// Return all employees info
const deleteCustomer: CustomerHandlers['deleteCustomer'] = async ({
  res,
  req,
  body,
  // config,
}) => {
    try{
        await dbConnect()
        const data = await User.deleteOne({
            _id : req.query.id
        })
        const chkContract = await User.findOne({
            _id : req.query.id
        })
        if(chkContract){
            return res.status(400).json({
                data:null,
                errors:[{message:"xóa không thành công"}]
            })
        }else{
            return res.status(200).json({
                data:null,
                errors:[{message:"xóa thành công"}]
            })
        }
    }catch(error){
        return res.status(500).json({
            data: null,
            errors: [{message: error.message}],
          });
    }
}


export default deleteCustomer
import dbConnect from '@/utils/dbConnect';
import User, { CustomerDocument } from '@/models/User';
import type { CustomerHandlers } from 'Backend/api/customer/indexId';

// Return all employees info
const updateCustomer: CustomerHandlers['updateCustomer'] = async ({
  res,
  req,
  body,
  // config,
}) => {
    let result: { data?: CustomerDocument } = {}
    const update = req.body.update
    try{
        await dbConnect();
        const chkContract = await User.findOne({
            _id : req.query.id,
        })
        if(!chkContract){
            return res.status(400).json({
                data: null,
                errors:[{message:"ko tìm thấy Contract"}]
            })
        }
        result.data = await User.findOneAndUpdate({
            _id:req.query.id,
        },update,{new:true})
        if(!result.data){
            return res.status(400).json({
                data: null,
                errors:[{message:"cập nhật ko thành công"}]
            })
        }else{
            return res.status(200).json({
                data : result.data,
                errors:[{message:" cập nhật thành công"}]
            })
        }

    }catch(error){
        return res.status(500).json({
            data:null,
            errors:[{message:error.message}]
        })
    }
}


export default updateCustomer
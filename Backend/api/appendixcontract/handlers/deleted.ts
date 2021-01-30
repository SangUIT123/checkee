 
import dbConnect from '@/utils/dbConnect';
import AppendixContract, { AppendixContractDocument } from '@/models/AppendixContract';
import type { AppendixContractHandlers } from 'Backend/api/appendixcontract/indexId';

const deleted : AppendixContractHandlers['deleted'] = async ({
  res,
  req,
  body,
}) => {
    try{
        await dbConnect()
        const data = await AppendixContract.deleteOne({
            _id : req.query.id
        })
        const chkContract = await AppendixContract.findOne({
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

export default deleted
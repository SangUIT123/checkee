
import dbConnect from '@/utils/dbConnect';
import Contract, { ContractDocument } from '@/models/Contract';
import type { ContractHandlers } from '..';

const getAllContract : ContractHandlers['getAllContract'] = async ({
  res,
  req,
  body,
}) => {
    await dbConnect();
    let result: { data?: ContractDocument[] } = {}
    try{
        result.data = await Contract.find().sort({
            createdAt: "desc",
          }).lean();
    }catch(error){
        return res.status(500).json({
            data:null,
            errors:[{message:error.message}]
        })
    }
    return res.status(200).json({ data: result.data ?? null })
}

export default getAllContract
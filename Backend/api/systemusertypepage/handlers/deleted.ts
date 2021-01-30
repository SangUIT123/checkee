
import dbConnect from '@/utils/dbConnect';
import SystemUserTypePage, { SystemUserTypePageDocument } from '@/models/SystemUserTypePage';
import type { SystemUserTypePageHandlers } from 'Backend/api/systemusertypepage/indexId'
const deleted : SystemUserTypePageHandlers['deleted'] = async ({
  res,
  req,
  body,
}) => {
  let result: { data?: SystemUserTypePageDocument } = {}
  try {
    await dbConnect()
        const data = await SystemUserTypePage.deleteOne({
            _id : req.query.id
        })
        const chkUserType = await SystemUserTypePage.findOne({
            _id : req.query.id
        })
        if(chkUserType){
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
    
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{message: error.message}],
    });
  }
}

export default deleted
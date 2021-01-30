import dbConnect from '@/utils/dbConnect';
import User, { UserDocument } from '@/models/User';
import type { UsersHandlers } from '..';


// Return all employees info
const updateUser: UsersHandlers['updateUser'] = async ({
  res,
  req,
  body,
  // config,
}) => {
  let result: { data?: UserDocument[] } = {}
  
  try {
    await dbConnect()

    const userID = req.body.userID;

    const update = req.body.update;

    if (update.email) {
        return res.status(400).json({
            data: null,
            errors: [{message: 'Không cho phép cập nhật email'}],
        });
    }

    if (update.password) {
        return res.status(400).json({
            data: null,
            errors: [{message: 'Không cho phép cập nhật password'}],
        });
    }

    if (!userID) {
        return res.status(400).json({
            data: null,
            errors: [{message: 'userID không xác định'}],
        });
    } 

    const _user = await User.findOneAndUpdate({
        _id: userID,
        isDeleted: false 
    }, update, {new: true});
    

    if (!_user || _user === null || _user === '') {
        return res.status(400).json({
            data: null,
            errors: [{message: 'User không tồn tại'}],
        });
    } 

    result.data = _user;

   
    
  } catch (error) {
    return res.status(400).json({
      data: null,
      errors: [{message: error.message}],
    });
  }

    return res.status(200).json({
        data: result.data,
        errors: [{message: 'Cập nhật thành công.'}],    
    });
  

}

export default updateUser
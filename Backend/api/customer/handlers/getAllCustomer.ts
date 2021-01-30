import dbConnect from '@/utils/dbConnect';
import User, { CustomerDocument } from '@/models/User';
import type { CustomerHandlers } from '..';
import validator from "validator";
import passValidator from "password-validator"

const passSchema = new passValidator();
const passMinLen = 6;
const passMaxLen = 24;

// Scheme for password validation
// See ref https://github.com/tarunbatra/password-validator
passSchema
  .is().min(passMinLen)
  .is().max(passMaxLen)
  .has().letters()
  .has().digits();


// Return all employees info
const getAllCustomer: CustomerHandlers['getAllCustomer'] = async ({
  res,
  req,
  body,
  // config,
}) => {
  let result: { data?: CustomerDocument[] } = {}
  
  try {
    await dbConnect()

    result.data = await User.find({})
    .where('taxCode').ne(null)
    .sort({
      createdAt: "desc",
    });
    
  } catch (error) {
    return res.status(400).json({
      data: null,
      errors: [{message: error.message, code: "err002"}],
    });
  }
  

  return res.status(200).json({ data: result.data ?? null })
}


export default getAllCustomer
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
const addCustomer: CustomerHandlers['addCustomer'] = async ({
  res,
  req,
  body,
  // config,
}) => {
  let result: { data?: CustomerDocument[] } = {}
  
  try {
    await dbConnect()

    console.log('body', body)

    if (!body.email || !validator.isEmail(body.email)) {
      return res.status(400).json({
        data: null,
        errors: [{message: "Email không hợp lệ"}],
      })    
    }

    if (!passSchema.validate(body.password)) {
      return res.status(400).json({
        data: null,
        errors: [{message: "Password must be 6-24 characters, including letters and digits", code:"err001"}],
      })  
    }

    const _data = await User.create(body);

    result.data = await User.find({
      _id: _data.id
    })

    // const newCustomer = new User({ 
    //   ...req.body
    // });

    // result.data = await newCustomer.save();

    await User.find() 
    
  } catch (error) {
    return res.status(400).json({
      data: null,
      errors: [{message: error.message, code: "err002"}],
    });
  }
  

  return res.status(200).json({ data: result.data ?? null })
}

export default addCustomer
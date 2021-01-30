import dbConnect from '@/utils/dbConnect';
import User, { ParticipantDocument } from '@/models/User';
import type { ParticipantHandlers } from '..';
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
const addParticipant: ParticipantHandlers['addParticipant'] = async ({
  res,
  req,
  body,
  // config,
}) => {
  let result: { data?: ParticipantDocument[] } = {}
  
  try {
    await dbConnect()

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

    const newUser = new User({ 
      ...req.body
    });

    result.data = await newUser.save();

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

export default addParticipant
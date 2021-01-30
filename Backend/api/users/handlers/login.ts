import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { serialize } from 'cookie';
import type { UsersHandlers } from '../login';

const loginHandler: UsersHandlers['login'] = async ({
  res,
  //req,
  body: { email, password },
  // config,
}) => {
  // TODO: Add proper validations with something like Ajv
  if (!(email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }],
    })
  }
  // TODO: validate the password and email
  // Passwords must be at least 8 characters and contain both alphabetic
  // and numeric characters.
  
  try {
    await dbConnect()

    const user = await User.findOne({
      email,
      isDeleted: false
    });

    if (!user) {
      return res.status(400).json({
        data: null,
        errors: [{ message: 'Không tìm thấy địa chỉ mail ' + email }],
      });
    }

    const isValidPassword = await user.comparePassword(password)

    // Validate password
    if (!isValidPassword) {
      return res.status(400).json({
        data: null,
        errors: [{ message: 'Password không hợp lệ.' }],
      });
    }

    const jwt = user.generateJWT()

    res.setHeader('Set-Cookie', serialize('user-token', jwt, {
      httpOnly: true,
      maxAge: 604800, // 1 week
      // secure: process.env.NODE_ENV !== 'development',
      secure: false,
      sameSite: 'strict',
      path: '/'
    }))

  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }

  return res.status(200).json({ data: null })
}

export default loginHandler
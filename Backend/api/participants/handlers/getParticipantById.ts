import dbConnect from '@/utils/dbConnect';
import User, { ParticipantDocument } from '@/models/User';
import type { ParticipantHandlers } from '../id';


// Return all Participants info
const getParticipantById: ParticipantHandlers['getParticipantById'] = async ({
  res,
  req,
  // body,
  // config,
}) => {
  let result: { data?: ParticipantDocument } = {}
  
  try {
    await dbConnect()

    result.data = await User.findOne({
        _id: req.query.id
    })
    
    if (!result.data || result.data === null) {
        return res.status(400).json({
            data: null,
            errors: [{message: 'User không tồn tại'}],
        });
    } 
    
  } catch (error) {
    return res.status(400).json({
      data: null,
      errors: [{message: error.message, code: "err002"}],
    });
  }
  

  return res.status(200).json({ data: result.data ?? null })
}

export default getParticipantById
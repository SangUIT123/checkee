import dbConnect from '@/utils/dbConnect';
import User, { ParticipantDocument } from '@/models/User';
import type { ParticipantHandlers } from '..';


// Return all Participants info
const getAllParticipants: ParticipantHandlers['getAllParticipants'] = async ({
  res,
  // req,
  // body,
  // config,
}) => {
  let result: { data?: ParticipantDocument[] } = {}
  
  try {
    await dbConnect()

    result.data = await User.find({})
    .where('participantName').ne(null)
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

export default getAllParticipants
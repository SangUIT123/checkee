import dbConnect from '@/utils/dbConnect';
import User, { ParticipantDocument } from '@/models/User';
import type { ParticipantHandlers } from '../id';


// Return all Participants info
const deleteParticipant: ParticipantHandlers['deleteParticipant'] = async ({
  res,
  req,
  // body,
  // config,
}) => {
    let result: { data?: ParticipantDocument } = {}
    
    try {
        await dbConnect()

        const result = await User.deleteOne({
            _id: req.query.id
        });


        if (result.deletedCount !== 1) {
            return res.status(400).json({
                data: null,
                errors: [{message: "Xóa bản ghi thất bại."}],
            });
        }

    
  } catch (error) {
        return res.status(400).json({
            data: null,
            errors: [{message: error.message, code: "err002"}],
        });
    }

    return res.status(200).json({
        data: null,
        errors: [{message: "Xóa bản ghi thành công."}],
    });
  
}

export default deleteParticipant
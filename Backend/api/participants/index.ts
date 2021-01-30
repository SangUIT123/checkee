import isAllowedMethod from '@/utils/is-allowed-method';
import { ParticipantDocument } from '@/models/User';
import  createApiHandler, {
    CheckeeApiHandler,
    CheckeeHandler,
} from '@/utils/create-api-handler';
import addParticipant from './handlers/addParticipant';
import getAllParticipants from './handlers/getAllParticipants';
import updateParticipant from './handlers/updateParticipant';


export type SignupBody = {
    code: string
    email: string
    password: string
    address: string
    phone: string
    participantName: string
    participantType: string
}

export type ParticipantHandlers = {
    addParticipant: CheckeeHandler<ParticipantDocument[], SignupBody>
    getAllParticipants: CheckeeHandler<ParticipantDocument[]>
    updateParticipant: CheckeeHandler<ParticipantDocument[]>
}


const METHODS = ['POST', 'GET', 'PUT', 'DELETE']

const participantsAPI: CheckeeApiHandler<ParticipantDocument[], ParticipantHandlers> = async (
    req,
    res,
    handlers
) => {
    if (!isAllowedMethod(req, res, METHODS)) return

    try {
        if (req.method === 'POST') {
            const body = { ...req.body }
            return await handlers['addParticipant']({ req, res, /* config, */ body })
        }

        if (req.method === 'GET') {
            const body = null;
            return await handlers['getAllParticipants']({ req, res, body })
        }

        if (req.method === 'PUT') {
            const body = { ...req.body };
            return await handlers['updateParticipant']({ req, res, body })
        }

        // if (req.method === 'DELETE') {
        //     const body = { ...req.body };
        //     return await handlers['deleteParticipant']({ req, res, body })
        // }
    } catch (error) {
        console.error(error)

       

        res.status(500).json({ data: null, errors: [{ message: error.message }], })
    }
}

export const handlers = { addParticipant, getAllParticipants, updateParticipant }

export default createApiHandler(participantsAPI, handlers, {})
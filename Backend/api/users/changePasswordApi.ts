import isAllowedMethod from '@/utils/is-allowed-method';
import { UserDocument } from '@/models/User';
import  createApiHandler, {
    CheckeeApiHandler,
    CheckeeHandler,
} from '@/utils/create-api-handler';
import login from './handlers/login';


export type SigninBody = {
    email: string
    password: string
}

export type UserToken = {
    user: UserDocument
    token: string
}

export type UsersHandlers = {
    login: CheckeeHandler<UserToken, SigninBody>
}


const METHODS = ['POST', 'GET']

const loginApi: CheckeeApiHandler<UserToken, UsersHandlers> = async (
    req,
    res,
    // config,
    handlers
) => {
    if (!isAllowedMethod(req, res, METHODS)) return

    try {
        // Return all User info
        // if (req.method === 'GET') {
        //     const body = null
        //     return await handlers['getUsers']({ req, res, /* config, */  body  })
        // }

        // Create or add new User
        if (req.method === 'POST') {
            const body = { ...req.body }
            return await handlers['login']({ req, res, /* config, */ body })
        }

        // // Update employees
        // if (req.method === 'PUT') {
        //     const body = { ...req.body, employeeId }
        //     return await handlers['updateEmployee']({ req, res, config, body })
        // }

        // // Remove employees
        // if (req.method === 'DELETE') {
        //     const body = { ...req.body, employeeId }
        //     return await handlers['removeEmployee']({ req, res, config, body })
        // }
    } catch (error) {
        console.error(error)

        // const message =
        //     error instanceof CheckeeApiError
        //         ? 'An unexpected error ocurred with the Checkee API'
        //         : 'An unexpected error ocurred'

        res.status(500).json({ data: null, errors: [{ message: error.message }], })
    }
}

export const handlers = { login }

export default createApiHandler(loginApi, handlers, {})
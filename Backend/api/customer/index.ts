import isAllowedMethod from '@/utils/is-allowed-method';
import { CustomerDocument } from '@/models/User';
import  createApiHandler, {
    CheckeeApiHandler,
    CheckeeHandler,
} from '@/utils/create-api-handler';
import addCustomer from './handlers/addCustomer';
import getAllCustomer from './handlers/getAllCustomer';
export type SignupBody = {
    name_customer: string
    email: string
    password: string
    taxCode: number
    bank: string
    fax: number
    certificate_image: string[]
    account_number: number

}

export type CustomerHandlers = {
    addCustomer: CheckeeHandler<CustomerDocument[], SignupBody>
    getAllCustomer: CheckeeHandler<CustomerDocument[]>
}


const METHODS = ['POST','GET']

const customersAPI: CheckeeApiHandler<CustomerDocument[], CustomerHandlers> = async (
    req,
    res,
    handlers
) => {
    if (!isAllowedMethod(req, res, METHODS)) return

    try {
        if (req.method === 'POST') {
            const body = { ...req.body }
            return await handlers['addCustomer']({ req, res, /* config, */ body })
        }
        if (req.method === 'GET') {
            const body = null
            return await handlers['getAllCustomer']({ req, res, /* config, */ body })
        }
    } catch (error) {
        console.error(error)

       

        res.status(500).json({ data: null, errors: [{ message: error.message }], })
    }
}

export const handlers = { addCustomer, getAllCustomer }

export default createApiHandler(customersAPI, handlers, {})
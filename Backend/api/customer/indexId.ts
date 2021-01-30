import isAllowedMethod from '@/utils/is-allowed-method';
import { CustomerDocument } from '@/models/User';
import  createApiHandler, {
    CheckeeApiHandler,
    CheckeeHandler,
} from '@/utils/create-api-handler';
import updateCustomer from './handlers/updateCustomer';
import deleteCustomer from './handlers/deletedCustomer';
import getCustomerById from './handlers/getCustomerById';
export type updateBody = {
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
    updateCustomer: CheckeeHandler<CustomerDocument, updateBody>
    deleteCustomer: CheckeeHandler<CustomerDocument>
    getCustomerById: CheckeeHandler<CustomerDocument>
}


const METHODS = ['POST','PUT','GET','DELETE']

const customersAPI: CheckeeApiHandler<CustomerDocument, CustomerHandlers> = async (
    req,
    res,
    handlers
) => {
    if (!isAllowedMethod(req, res, METHODS)) return

    try {
        if (req.method === 'PUT') {
            const body = { ...req.body }
            return await handlers['updateCustomer']({ req, res, /* config, */ body })
        }
        if (req.method === 'DELETE') {
            const body = null
            return await handlers['deleteCustomer']({ req, res, /* config, */ body })
        }
        if (req.method === 'GET') {
            const body = null
            return await handlers['getCustomerById']({ req, res, /* config, */ body })
        }
    } catch (error) {
        console.error(error)

       

        res.status(500).json({ data: null, errors: [{ message: error.message }], })
    }
}

export const handlers = { updateCustomer,deleteCustomer, getCustomerById}

export default createApiHandler(customersAPI, handlers, {})
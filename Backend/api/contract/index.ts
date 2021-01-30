import isAllowedMethod from '@/utils/is-allowed-method';
import mongoose, {  } from "mongoose";
import Contract, { ContractDocument } from '@/models/Contract';
import  createApiHandler, {
    CheckeeApiHandler,
    CheckeeHandler,
} from '@/utils/create-api-handler';
import createContract from './handlers/createContract';
import getAllContract from'./handlers/getAllContract';
export type CreateBody = {
    numberContract : string;
    date : Date;
    nameContract : string;
    durationPay : string;
    packageBuy : string;
    contractValue : number;
    vat : number;
    vatPrice : number;
    fileDoc : string;
    publicKey: string;
    privateKey: string;
    startDay: Date;
    endDay: Date;
    createBy:mongoose.Schema.Types.ObjectId;
}
export type ContractHandlers = {
    createContract: CheckeeHandler<ContractDocument[], CreateBody>
    getAllContract : CheckeeHandler<ContractDocument[]>
}
const METHODS = ['POST','GET','PUT','DELETE']
const ContractAPI : CheckeeApiHandler<ContractDocument[], ContractHandlers> = async(
    req,
    res,
    handlers
)=>{
    if(!isAllowedMethod(req,res,METHODS)) return 
    try{
        if(req.method ==='POST'){
            const body ={ ...req.body}
            return await handlers['createContract']({req,res,body})
        }
        if(req.method ==='GET'){
            const body = null
            return await handlers['getAllContract']({req,res,body})
        }
        
    }catch(error){
        console.error(error)
        res.status(500).json({ data :null, errors:[{message: error.message}],})
    }
}



export const handlers = { createContract, getAllContract}
export default createApiHandler(ContractAPI, handlers,{})




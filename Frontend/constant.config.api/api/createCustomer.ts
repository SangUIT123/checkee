import axios from 'axios'
import { CUSTOMER } from '../index'

export default async function createCustomer(customerData){
  let data = null; 

  await axios.post(CUSTOMER, customerData)
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = err
    })

  return data;
}
import axios from 'axios'
import { CUSTOMER } from '../index'

export default async function getCustomer(){
  let data = null; 

  await axios.get(CUSTOMER)
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = err
    })

  return data;
}
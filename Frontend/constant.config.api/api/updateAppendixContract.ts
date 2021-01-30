import axios from 'axios'
import { APPENDIXCONTRACT } from '../index'

export default async function updateAppendixContract({id, ...rest}){
  let data = null; 
  await axios.put(APPENDIXCONTRACT + '/' + id, {
      update : {
        ...rest
      }
    })
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = err
    })

  return data;
}
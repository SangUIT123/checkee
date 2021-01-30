import { call, put, takeLatest } from 'redux-saga/effects'
import { 
  actionTypes,
  getCustomerSuccess, 
  getCustomerFailure,
  createCustomerSuccess,
  createCustomerFailure,
  updateCustomerSuccess,
  updateCustomerFailure,
  deleteCustomerSuccess,
  deleteCustomerFailure,
} from '../actions/CustomerActions'
import getCustomer from '../../constant.config.api/api/getAllCustomer'
import createCustomer from '../../constant.config.api/api/createCustomer'
import updateCustomer from '../../constant.config.api/api/updateCustomer'
import deleteCustomer from '../../constant.config.api/api/deleteCustomer'
import toast from "@/ShowToast/ShowToast";


import NProgress from 'nprogress'

export function* getCustomerProcess() {
  try { 
    const response = yield call(getCustomer)
    yield put(getCustomerSuccess(response.data.data))
  } catch(err) {
    yield put(getCustomerFailure(err))
  }
}

export function* createCustomerProcess(action) {
  try { 
    const response = yield call(createCustomer, action.payload)
    yield put(createCustomerSuccess(response.data.data))
    NProgress.done()
    toast({ type: "success", message: "Tạo mới đối tác thành công" });
  } catch(err) {
    yield put(createCustomerFailure(err))
    toast({ type: "error", message: "Có gì đó sai sai"})
  }
}

export function* updateCustomerProcess(action) {
  try {
    const response = yield call(updateCustomer, action.payload)
    yield put(updateCustomerSuccess(response.data.data))
    NProgress.done()
    toast({ type: "success", message: "Cập nhật đối tác thành công" });
  } catch(err) {
    yield put(updateCustomerFailure(err))
    toast({ type: "error", message: "Có gì đó sai sai"})
  }
}

export function* deleteCustomerProcess(action) {
  try {
    const response = yield call(deleteCustomer, action.payload)
    yield put(deleteCustomerSuccess(response.data.data))
    NProgress.done()
    toast({ type: "success", message: "Xóa đối tác thành công" });
  } catch(err) {
    yield put(deleteCustomerFailure(err))
    toast({ type: "error", message: "Có gì đó sai sai"})  
  }
}

export function* onGetCustomerStart() {
  yield takeLatest(actionTypes.GET_CUSTOMER_START, getCustomerProcess)
}

export function* onCreateCustomerStart() {
  yield takeLatest(actionTypes.CREATE_CUSTOMER_START, createCustomerProcess)
}

export function* onUpdateCustomerStart() {
  yield takeLatest(actionTypes.UPDATE_CUSTOMER_START, updateCustomerProcess)
}

export function* onDeleteCustomerStart() {
  yield takeLatest(actionTypes.DELETE_CUSTOMER_START, deleteCustomerProcess)
}

const sagas = [
  call(onGetCustomerStart),
  call(onCreateCustomerStart),
  call(onUpdateCustomerStart),
  call(onDeleteCustomerStart),
]

export default sagas
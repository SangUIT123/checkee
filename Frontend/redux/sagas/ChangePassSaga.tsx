import { call, put, takeLatest } from "redux-saga/effects";
import { actionTypes, changePassSuccess, changePassFailure } from "../actions/ChangePassActions";
import changePass from "../../constant.config.api/api/changePassword";
import NProgress from 'nprogress'
import toast from "@/ShowToast/ShowToast";


function* changePassSaga(action) {

  try {
    const response = yield call(changePass, action.payload);
    if (response.status === 200) {
      yield put(changePassSuccess(response.data.data));
      NProgress.done();
      toast({ type: "success", message: "Đổi mật khẩu thành công" });
    }
    else {
      yield put(changePassFailure(response.data.errors[0].message));
      NProgress.done();  
        toast({ type: "error", message: response.data.errors[0].message });
    }
  } catch (err) {
    yield put(changePassFailure(err));
    NProgress.done();
    toast({ type: "error", message: err });
  }
}

const sagas = [takeLatest(actionTypes.CHANGE_PASSWORD, changePassSaga)];

export default sagas;

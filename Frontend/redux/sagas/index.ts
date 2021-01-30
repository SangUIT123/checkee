import { all, fork } from "redux-saga/effects";
import Employee from "./EmployeeSaga";
import SignUp from "./SignUpSaga";
import Login from "./LoginSaga";
import ListUser from "./ListUserSaga";
import Logout from "./LogoutSaga";
import Customer from "./CustomerSaga";
import AppendixContract from "./AppendixContractSaga";
import SystemPage from "./SystemPageSaga";
import UserType from "./UserTypeSaga";
import ForgotPass from "./ForgotPassSaga";
import SystemUserTypePage from "./SystemUserTypePageSaga";
import ChangePass from "./ChangePassSaga";
import ManagementMenu from "./ManagementMenuSaga";
export default function* rootSaga() {
  yield all([
    ...Employee,
    ...SignUp,
    ...Login,
    ...ListUser,
    ...Logout,
    ...Customer,
    ...AppendixContract,
    ...SystemPage,
    ...UserType,
    ...ForgotPass,
    ...SystemUserTypePage,
    ...ChangePass,
    ...ManagementMenu,
  ]);
}

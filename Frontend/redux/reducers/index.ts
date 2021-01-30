import { combineReducers } from "redux";
import Employee from "./EmployeeReducer";
import SignUp from "./SignUpReducer";
import Login from "./LoginReducer";
import ListUser from "./ListUserReducer";
import Logout from "./LogoutReducer";
import SystemPage from "./SystemPageReducer";
import UserType from "./UserTypeReducer";
import ForgotPass from "./ForgotPassReducer";
import SystemUserTypePage from "./SystemUserTypePageReducer";
import Customer from "./CustomerReducer";
import AppendixContract from "./AppendixContractReducer";
import ManagementMenu from "./ManagementMenuReducer";
import ChangePass from "./ChangePassReducer";

const appReducer = combineReducers({
  Employee,
  SignUp,
  Login,
  ListUser,
  Logout,
  SystemPage,
  UserType,
  ForgotPass,
  SystemUserTypePage,
  Customer,
  AppendixContract,
  ChangePass,
  ManagementMenu,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === "LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

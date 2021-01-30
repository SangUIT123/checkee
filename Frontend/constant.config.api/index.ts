const SERVERAPI = "http://localhost:3000/";
const EMPLOYEE = SERVERAPI + "api/employees";
const SIGNUP = SERVERAPI + "api/users";
const LOGIN = SERVERAPI + "api/users/login";
const LOGOUT = SERVERAPI + "api/users/logout";
const CONTRACT = SERVERAPI + "api/contract";
const APPENDIXCONTRACT = SERVERAPI + "api/appendixcontract";
const CUSTOMER = SERVERAPI + "api/customer";
const GETUSERLOGIN = SERVERAPI + "api/users/get-logged-in-user";
const DELETEDUSER = SERVERAPI + "api/users";
const CREATEUSER = SERVERAPI + "api/users";
const LISTUSER = SERVERAPI + "api/users";
const UPDATEUSER = SERVERAPI + "api/users";
const SYSTEMPAGE = SERVERAPI + "api/systempage";
const USERTYPE = SERVERAPI + "api/usertype";
const FORGOTPASS = SERVERAPI + "api/users/recovery";
const SYSTEMUSERTYPEPAGE = SERVERAPI + "api/systemusertypepage";
const MANAGEMENTMENU = SERVERAPI + "api/systempagemenu";
const CHECKACCESSRIGHT = SERVERAPI + "api/systemusertypepage/aceess-right";
const CHANGEPASSWORD = SERVERAPI + "api/users/change-password";

export {
  EMPLOYEE,
  SIGNUP,
  LOGIN,
  LOGOUT,
  CUSTOMER,
  CONTRACT,
  APPENDIXCONTRACT,
  GETUSERLOGIN,
  DELETEDUSER,
  CREATEUSER,
  LISTUSER,
  UPDATEUSER,
  SYSTEMPAGE,
  USERTYPE,
  FORGOTPASS,
  SYSTEMUSERTYPEPAGE,
  CHANGEPASSWORD,
  MANAGEMENTMENU,
  CHECKACCESSRIGHT
};

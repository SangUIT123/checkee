export const actionTypes = {
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    CHANGE_PASSWORD_SUCCESS: "CHANGE_PASSWORD_SUCCESS",
    CHANGE_PASSWORD_FAILURE: "CHANGE_PASSWORD_FAILURE"
  };

export interface IChangePass {
    email: string,
    password: string,
    new_password: string,
    new_password_confirm: string
}

  export function changePass(values: IChangePass) {
    return {
      type: actionTypes.CHANGE_PASSWORD,
      payload: values
    };
  }
  
  export function changePassSuccess(data: IChangePass[]) {
    return {
      type: actionTypes.CHANGE_PASSWORD_SUCCESS,
      payload: {
        data: data,
      }
    };
  }
  
  export function changePassFailure(error: any) {
    return {
      type: actionTypes.CHANGE_PASSWORD_FAILURE,
      payload: {
        error: error
      }
    };
  }
  

export const actionTypes = {
    GET_CUSTOMER_START: "GET_CUSTOMER_START",
    GET_CUSTOMER_SUCCESS: "GET_CUSTOMER_SUCCESS",
    GET_CUSTOMER_FAILURE: "GET_CUSTOMER_FAILURE",

    CREATE_CUSTOMER_START: "CREATE_CUSTOMER_START",
    CREATE_CUSTOMER_SUCCESS: "CREATE_CUSTOMER_SUCCESS",
    CREATE_CUSTOMER_FAILURE: "CREATE_CUSTOMER_FAILURE",

    UPDATE_CUSTOMER_START: "UPDATE_CUSTOMER_START",
    UPDATE_CUSTOMER_SUCCESS: "UPDATE_CUSTOMER_SUCCESS",
    UPDATE_CUSTOMER_FAILURE: "UPDATE_CUSTOMER_FAILURE",

    DELETE_CUSTOMER_START: "DELETE_CUSTOMER_START",
    DELETE_CUSTOMER_SUCCESS: "DELETE_CUSTOMER_SUCCESS",
    DELETE_CUSTOMER_FAILURE: "DELETE_CUSTOMER_FAILURE",
  };

export interface ICustomer {
    _id: String,
    name_customer: String,
    taxCode: String,
    bank: String,
    account_number: String,
    phone: String,
    address: String,
    fax: String,
    email: String,
    certificate_image: Array<String>
}
export interface CustomerState {
  readonly data: ICustomer[],
}

/* GET ALL CUSTOMER */

  export function getCustomerStart() {
    return {
      type: actionTypes.GET_CUSTOMER_START
    };
  }
  
  export function getCustomerSuccess(data: ICustomer[]) {
    return {
      type: actionTypes.GET_CUSTOMER_SUCCESS,
      payload: {
        data: data
      }
    };
  }
  
  export function getCustomerFailure(error: any) {
    return {
      type: actionTypes.GET_CUSTOMER_FAILURE,
      payload: {
        error: error
      }
    };
  }

  /* ADD CUSTOMER */

  export function createCustomerStart(values: ICustomer) {
    return {
      type: actionTypes.CREATE_CUSTOMER_START,
      payload: values
    };
  }

  export function createCustomerSuccess(data: ICustomer[]) {
    return {
      type: actionTypes.CREATE_CUSTOMER_SUCCESS,
      payload: {
        data: data,
      }
    };
  }
  
  export function createCustomerFailure(error: any) {
    return {
      type: actionTypes.CREATE_CUSTOMER_FAILURE,
      payload: {
        error: error,
      }
    };
  }


  /* UPDATE CUSTOMER */

  export function updateCustomerStart(updates: ICustomer) {
    return {
      type: actionTypes.UPDATE_CUSTOMER_START,
      payload: updates
    };
  }

  export function updateCustomerSuccess(data: ICustomer[]) {
    return {
      type: actionTypes.UPDATE_CUSTOMER_SUCCESS,
      payload: {
        data: data,
      }
    };
  }
  
  export function updateCustomerFailure(error: any) {
    return {
      type: actionTypes.UPDATE_CUSTOMER_FAILURE,
      payload: {
        error: error,
      }
    };
  }


  /* DELETE CUSTOMER */

  export function deleteCustomerStart(updates: ICustomer) {
    return {
      type: actionTypes.DELETE_CUSTOMER_START,
      payload: updates
    };
  }

  export function deleteCustomerSuccess(data: ICustomer[]) {
    return {
      type: actionTypes.DELETE_CUSTOMER_SUCCESS,
      payload: {
        data: data,
      }
    };
  }
  
  export function deleteCustomerFailure(error: any) {
    return {
      type: actionTypes.DELETE_CUSTOMER_FAILURE,
      payload: {
        error: error,
      }
    };
  }
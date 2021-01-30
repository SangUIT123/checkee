import updateCustomer from "Frontend/constant.config.api/api/updateCustomer";
import produce from "immer";
import { actionTypes } from "../actions/MangementMenuAction";
//
const initialState = {
  listDataManagementMenu: null,
  errorDataManagementMenu: null,
};
//load data
const succecssloadData = (draft: any, { data }: any) => {
  draft.listDataManagementMenu = data;
};
const failLoadData = (draft: any, { error }: any) => {
  draft.errorDataManagementMenu = error;
};
//deleted data
const failDeletedData = (draft: any, { error }: any) => {
  draft.errorDataManagementMenu = error;
};
//created data
const failCreateData = (draft: any, { error }: any) => {
  draft.errorDataManagementMenu = error;
};
//updated data
const failUpdateData = (draft: any, { error }: any) => {
  draft.errorDataManagementMenu = error;
};

//
const ManagementMenu = (state = initialState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      //action load data
      case actionTypes.LOAD_DATA_MANAGEMENT_SUCCESS:
        succecssloadData(draft, action.payload);
        break;
      case actionTypes.LOAD_DATA_MANAGEMENT_FAIL:
        failLoadData(draft, action.payload);
        break;
      //action deleted data
      case actionTypes.DELETED_DATA_MANAGEMENT_SUCCESS:
        const newData = state.listDataManagementMenu.filter(
          (todo) => todo._id !== action.payload.id
        );
        return {
          ...state,
          errorDataManagementMenu: null,
          listDataManagementMenu: newData,
        };
      case actionTypes.DELETED_DATA_MANAGEMENT_FAIL:
        failDeletedData(draft, action.payload);
        break;
      //action create data
      case actionTypes.CREATE_DATA_MANAGEMENT_SUCCESS:
        let newAdd = state.listDataManagementMenu.slice();
        newAdd.splice(0, 0, action.payload.data.data.data[0]);
        return {
          ...state,
          errorDataManagementMenu: null,
          listDataManagementMenu: newAdd,
        };
      case actionTypes.CREATE_DATA_MANAGEMENT_FAIL:
        failCreateData(draft, action.payload);
        break;
      //action update data
      case actionTypes.UPDATE_DATA_MANAGEMENT_SUCCESS:
        let updatedata = state.listDataManagementMenu.map((todo) =>
          todo._id === action.payload.id
            ? (todo = action.payload.data.data.data)
            : todo
        );
        return {
          ...state,
          errorDataManagementMenu: null,
          listDataManagementMenu: updatedata,
        };
      case actionTypes.UPDATE_DATA_MANAGEMENT_FAIL:
        failUpdateData(draft, action.payload);
        break;
    }
  });
};
export default ManagementMenu;

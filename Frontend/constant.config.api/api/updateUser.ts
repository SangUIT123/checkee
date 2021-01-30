import axios from "axios";
import { UPDATEUSER } from "./../index";
import { IListUser1 } from "./../../redux/actions/ListUserActions";
//
async function updateUser(values: IListUser1) {
  let data;
  let body = {
    userID: values._id,
    update: {
      firstName: values.firstName,
      lastName: values.lastName,
      birthday: values.birthday,
      sex: Number(values.sex),
      phone: values.phone,
      address: values.address,
      userType: values.userType,
      userTypeId: values.userTypeId,
      certificate_image: [values.certificate_image]
    },
  };
  await axios
    .put(UPDATEUSER, body)
    .then((res) => {
      data = res;
    })
    .catch((error) => {
      data = error;
    });
  return data;
}

export default updateUser;

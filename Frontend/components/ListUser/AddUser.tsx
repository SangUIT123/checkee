import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import FormControl from "@material-ui/core/FormControl";
import { useStyles } from "./style";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NProgress from "nprogress";
import { IListUser1, createData } from "../../redux/actions/ListUserActions";

import { loadUserType, IUserType } from "../../redux/actions/UserTypeActions";
import { Formik, useFormik } from "formik";
import PropTypes from "prop-types";

//
export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  const classess = useStyles();
  return (
    <MuiDialogTitle
      disableTypography
      className={classess.dialogtitle}
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classess.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
//pass

interface States {
  password: string;
  showpassword: boolean;
}
//Kiểm soát khi nhập
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const check = /^[^-]+$/;
const checknum = /^[^1]+$/;
//

export const Close = (b) => {
  const [value, setValue] = React.useState(b);
  return alert(value);
};
Close.PropTypes = {
  b: PropTypes.bool.isRequired,
};

export default function AddUser(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  //lay userType
  const [userTypeList, setUserTypeList] = React.useState(null);

  const state_userTypeList: IUserType[] = useSelector(
    (state: any) => state.UserType.userTypeList
  );
  React.useEffect(() => {
    dispatch(loadUserType());
  }, [dispatch]);

  React.useEffect(() => {
    setUserTypeList(state_userTypeList);
  }, [state_userTypeList!]);
  // console.log("userTypeList", userTypeList);
  //prop từ listUser
  const { showmodal, close } = props;
  const [showmodalagain, setShowmodalagain] = React.useState(showmodal);
  React.useEffect(() => {
    setShowmodalagain(showmodal);
  }, [props.showmodal]);

  // console.log("shomoda", showmodalagain, "", showmodal);
  //mật khẩu
  const [password, setpassword] = React.useState<States>({
    password: "",
    showpassword: false,
  });
  const handleClickShowPass = () => {
    setpassword({ ...password, showpassword: !password.showpassword });
  };

  //
  return (
    <Container>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={showmodal}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="customized-dialog-title" onClose={close}>
          <div>
            <Typography variant="h5">Thêm Mới Người Dùng</Typography>
          </div>
        </DialogTitle>
        <MuiDialogContent dividers className={classes.dialogcontent}>
          <Formik
            initialValues={{
              _id: "",
              firstName: "",
              lastName: "",
              phone: "",
              birthday: "",
              email: "",
              sex: 1,
              status: 1,
              address: "",
              userType: "",
              userTypeId: "-",
              password: "",
              certificate_image: "",
            }}
            validationSchema={yup.object({
              lastName: yup.string().required("Hãy nhập vào"),
              firstName: yup.string().required("Hãy nhập vào"),
              email: yup
                .string()
                .email("Định dạng chưa chính xác")
                .required("Hãy nhập vào"),
              phone: yup
                .string()
                .matches(phoneRegExp, "Chưa đúng định dạng số điện thoại")
                .required("Hãy nhập vào"),
              birthday: yup.date().required("Hãy lựa chọn ngày"),
              sex: yup
                .string()
                .matches(checknum, "Hãy chọn giới tính")
                .required("Hãy chọn giới tính"),
              address: yup.string().required("Hãy nhập vào"),
              userTypeId: yup
                .string()
                .matches(check, "Hãy chọn người dùng")
                .required("Hãy chọn người dùng"),
              password: yup
                .string()
                .required("Bắt buộc nhập")
                .min(6, "Mật khẩu phải lớn hơn 6 ký tự")
                .max(24, "Mật khẩu phải nhỏ hơn 24 ký tự"),
            })}
            onSubmit={(values: IListUser1) => {
              for (let i = 0; i < userTypeList.length; i++) {
                if (userTypeList[i]._id === values.userTypeId) {
                  values.userType = userTypeList[i].name;
                }
              }
              // console.log("valuesubmit", values);
              // alert(JSON.stringify(values, null, 2));
              dispatch(createData(values));
            }}
          >
            {(formikprops) => (
              <form onSubmit={formikprops.handleSubmit} noValidate>
                <div>
                  <div className={classes.div}>
                    <Typography variant="h6">Thông Tin Người Dùng</Typography>
                  </div>
                  <Grid container spacing={3}>
                    {/*--------------------------------------------Họ-Tên------------------------------------------ */}
                    <Grid item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            variant="outlined"
                            label="Họ"
                            id="lastname"
                            name="lastName"
                            onChange={formikprops.handleChange}
                            fullWidth={true}
                            size="small"
                            required
                            InputLabelProps={{ shrink: true }}
                            error={
                              formikprops.touched.lastName &&
                              Boolean(formikprops.errors.lastName)
                            }
                            helperText={
                              formikprops.touched.lastName &&
                              formikprops.errors.lastName
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            variant="outlined"
                            label="Tên"
                            id="firstname"
                            name="firstName"
                            onChange={formikprops.handleChange}
                            fullWidth={true}
                            size="small"
                            required
                            InputLabelProps={{ shrink: true }}
                            error={
                              formikprops.touched.firstName &&
                              Boolean(formikprops.errors.firstName)
                            }
                            helperText={
                              formikprops.touched.firstName &&
                              formikprops.errors.firstName
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/*------------------------------------------------SĐT------------------------------------------ */}
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Số điện thoại"
                        name="phone"
                        onChange={formikprops.handleChange}
                        fullWidth={true}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={
                          formikprops.touched.phone &&
                          Boolean(formikprops.errors.phone)
                        }
                        helperText={
                          formikprops.touched.phone && formikprops.errors.phone
                        }
                      />
                    </Grid>
                    {/*--------------------------------------------Ngày-Sinh------------------------------------------ */}
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Ngày sinh"
                        fullWidth={true}
                        size="small"
                        type="date"
                        name="birthday"
                        InputLabelProps={{ shrink: true }}
                        required
                        onChange={formikprops.handleChange}
                        error={
                          formikprops.touched.birthday &&
                          Boolean(formikprops.errors.birthday)
                        }
                        helperText={
                          formikprops.touched.birthday &&
                          formikprops.errors.birthday
                        }
                      />
                    </Grid>
                    {/*--------------------------------------------Email------------------------------------------ */}
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Email"
                        fullWidth={true}
                        name="email"
                        size="small"
                        // onChange={formikprops.handleChange}
                        value={formikprops.values.email}
                        InputLabelProps={{ shrink: true }}
                        // error={
                        //   formikprops.touched.email &&
                        //   Boolean(formikprops.errors.email)
                        // }
                        // helperText={
                        //   formikprops.touched.email && formikprops.errors.email
                        // }
                        disabled
                      />
                    </Grid>
                    {/*--------------------------------------------Giới-Tính------------------------------------------ */}
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth={true}
                        size="small"
                        variant="outlined"
                      >
                        <InputLabel
                          shrink
                          htmlFor="age-native-label-placeholder"
                        >
                          {formikprops.touched.sex &&
                          Boolean(formikprops.errors.sex) ? (
                            <span className={classes.boolean}>Giới Tính *</span>
                          ) : (
                            <span>Giới Tính *</span>
                          )}
                        </InputLabel>
                        <Select
                          // variant="filled"
                          name="sex"
                          labelWidth={80}
                          native
                          fullWidth={true}
                          value={formikprops.values.sex}
                          onChange={formikprops.handleChange}
                          error={
                            formikprops.touched.sex &&
                            Boolean(formikprops.errors.sex)
                          }
                          inputProps={{
                            id: "age-native-label-placeholder",
                          }}
                        >
                          <option value={1}>Selected</option>
                          <option value={2}>Nam</option>
                          <option value={3}>Nữ</option>
                        </Select>
                        <div className={classes.helptext}>
                          {" "}
                          {formikprops.touched.email && formikprops.errors.sex}
                        </div>
                      </FormControl>
                    </Grid>
                    {/*------------------------------------Địa-Chỉ------------------------------------------ */}
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Địa Chỉ"
                        fullWidth={true}
                        onChange={formikprops.handleChange}
                        name="address"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={
                          formikprops.touched.address &&
                          Boolean(formikprops.errors.address)
                        }
                        helperText={
                          formikprops.touched.address &&
                          formikprops.errors.address
                        }
                      />
                    </Grid>
                  </Grid>
                  <Divider className={classes.divider} />
                  <div className={classes.div}>
                    <Typography variant="h6">Thông Tin Đăng Nhập</Typography>
                  </div>
                  {/*------------------------------------Tên-Đăng-Nhập------------------------------------------- */}
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Tên đăng nhập"
                        fullWidth={true}
                        name="email"
                        onChange={formikprops.handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={
                          formikprops.touched.email &&
                          Boolean(formikprops.errors.email)
                        }
                        helperText={
                          formikprops.touched.email && formikprops.errors.email
                        }
                      />
                    </Grid>
                    {/*------------------------------------Loại-Người-Dùng------------------------------------------- */}
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth={true}
                        size="small"
                        variant="outlined"
                      >
                        <InputLabel id="demo-simple-select-label" shrink>
                          {formikprops.touched.userType &&
                          Boolean(formikprops.errors.userType) ? (
                            <span className={classes.boolean}>
                              Loại Người Dùng *
                            </span>
                          ) : (
                            <span>Loại Người Dùng *</span>
                          )}
                        </InputLabel>
                        <Select
                          variant="outlined"
                          native
                          name="userTypeId"
                          labelWidth={140}
                          value={formikprops.values.userTypeId}
                          onChange={formikprops.handleChange}
                          inputProps={{
                            id: "demo-simple-select-label",
                          }}
                          error={
                            formikprops.touched.userTypeId &&
                            Boolean(formikprops.errors.userTypeId)
                          }
                        >
                          <option value="-">Selected</option>
                          {userTypeList.map((userType, index) => {
                            return (
                              <option key={index} value={userType._id}>
                                {userType.name}
                              </option>
                            );
                            // <option value="-">Selected</option>
                            // <option value="SuperAdmin">SuperAdmin</option>
                            // <option value="Normal">Normal</option>
                          })}
                        </Select>
                        <div className={classes.helptext}>
                          {" "}
                          {formikprops.touched.userTypeId &&
                            formikprops.errors.userTypeId}
                        </div>
                      </FormControl>
                    </Grid>
                    {/*----------------------------------------Mật-Khẩu-Người-Dùng-------------------------------------- */}
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        label="Mật khẩu người dùng"
                        name="password"
                        fullWidth={true}
                        type={password.showpassword ? "text" : "password"}
                        onChange={formikprops.handleChange}
                        error={
                          formikprops.touched.password &&
                          Boolean(formikprops.errors.password)
                        }
                        helperText={
                          formikprops.touched.password &&
                          formikprops.errors.password
                        }
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPass}
                                // onMouseDown={handleMouseDownPassword}
                              >
                                {password.showpassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    {/*----------------------------------------Hình-Ảnh-------------------------------------------- */}
                    <Grid item xs={6}>
                      {/* <InputLabel shrink>Hình ảnh</InputLabel> */}
                      {/* <DropzoneArea onChange={handleChangeImg} /> */}
                      <TextField
                        type="file"
                        name="certificate_image"
                        label="Hình ảnh"
                        variant="outlined"
                        fullWidth={true}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event: any) => {
                          formikprops.setFieldValue(
                            "certificate_image",
                            event.target.files[0].name
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
                <Divider className={classes.divider} />
                {/*-----------------------------------------------Button-Submit------------------------------------------- */}
                <MuiDialogActions className={classes.DialogActions}>
                  <Button autoFocus onClick={close} variant="contained">
                    Hủy
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Thêm Người Dùng
                  </Button>
                </MuiDialogActions>
              </form>
            )}
          </Formik>
        </MuiDialogContent>
      </Dialog>
    </Container>
  );
}

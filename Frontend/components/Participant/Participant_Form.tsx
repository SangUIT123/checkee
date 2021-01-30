import React, { useEffect, useState, Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
//styles
import { useStyles, useRowStyles } from './Participant_Form.styles'

export default function Participant_Form(props){
  const classes = useStyles();
  const [openParticipantForm, setOpenParticipantForm] = React.useState(false);
  const [checkEdit, setCheckEdit] = React.useState(false);
  const [participant, setParticipant] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] =React.useState(false);

  const initialFormValues = {
    orderNo: participant ? participant.orderNo : "",
    participantName: participant ? participant.participantName : "",
    code: participant ? participant.code : "",
    participantType: participant ? participant.participantType : "",
    address: participant ? participant.address : "", 
    phone: participant ? participant.phone : "", 
    email: participant ? participant.email : "",
  }

  useEffect(()=>{
    setCheckEdit(props.checkEdit)
  },[props.checkEdit])

  useEffect(()=>{
    setOpenParticipantForm(openParticipantForm)
  },[openParticipantForm])

  useEffect(()=>{
    setParticipant(props.participant)
  },[props.participant])

  const handleOpen = () => {
    setOpenModal(true);
    setOpenParticipantForm(true)
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenParticipantForm(false)
  };

  const handleSubmit = (values, { resetForm }) => {
    alert(JSON.stringify({ ...values}, null, 2));
  }

  const handleFieldChange = (e, { handleChange, setFieldTouched }) => {
    handleChange(e)
    setFieldTouched(e.target.name, true, false)
  }

  // console.log("=========================================");
  // console.log("openParticipantForm", openParticipantForm);
  // console.log("checkEdit", checkEdit);
  return (
    <React.Fragment>
      {checkEdit ? (
        <Tooltip title="Chỉnh sửa" placement="top-start">
          <IconButton
            className={classes.iconButton}
            aria-label="edit"
            size="small"
            color="primary"
            onClick={handleOpen}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          size="small"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={handleOpen}
        >
          Thêm mới
        </Button>
      )}
      <Dialog
        open={openParticipantForm}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="lg"
        scroll="body"
      >
        <Formik
          initialValues={initialFormValues}
          validationSchema={yup.object({
            orderNo: yup
              .number()
              .min(0, "Số thứ tự không hợp lệ!")
              .required("Vui lòng nhập Số thứ tự!"),
            participantName: yup
              .string()
              .min(3, "Tên đối tượng phải lớn hơn 3!")
              .max(50, "Tên đối tượng phải nhỏ hơn 50!")
              .required("Vui lòng nhập tên đối tượng!"),
            code: yup
              .string()
              .min(3, "Mã đối tượng phải lớn hơn 3!")
              .max(50, "Mã đối tượng phải nhỏ hơn 50!")
              .required("Vui lòng nhập mã đối tượng!"),
            participantType: yup
              .string()
              .required('Loại đối tượng là bắt buộc'),
            address: yup 
              .string()
              .required('Địa chỉ là bắt buộc'), 
            phone: yup
              .string()
              .required('Số điện thoại là bắt buộc'), 
            email: yup
              .string()
              .required('Email là bắt buộc'),
          })}
          onSubmit={handleSubmit}
        >
          {(props) => (
          <form onSubmit={props.handleSubmit}>
              <DialogTitle
                id="form-dialog-title"
                className={classes.dialogTitle}
              >
                {!checkEdit
                  ? "Thêm mới đối tác"
                  : "Cập nhật đối tác"}
              </DialogTitle>
              <DialogContent>
                <Grid container>
                  <Grid item xs={12} sm={6} className={ classes.gridColumn }>
                    <Grid item>
                      <Grid item xs={12} className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>STT</InputLabel>
                          <TextField
                            name="orderNo"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            placeholder="Nhập vào số thứ tự!"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="number"
                            value={props.values.orderNo}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.orderNo &&
                              Boolean(props.errors.orderNo)
                            }
                            helperText={
                              props.touched.orderNo && props.errors.orderNo
                            }
                          />
                      </Grid>
                      <Grid item xs={12} className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>
                          Mã đối tượng
                        </InputLabel>
                          <TextField
                            name="participantName"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            placeholder="Nhập vào tên đối tượng!"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.participantName}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.participantName && Boolean(props.errors.participantName)
                            }
                            helperText={props.touched.participantName && props.errors.participantName}
                          />
                      </Grid>
                      <Grid item xs={12} className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>Địa chỉ</InputLabel>
                        
                          <TextField
                            name="address"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            placeholder="Nhập vào tài khoản ngân hàng!"
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.address}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.address && Boolean(props.errors.address)
                            }
                            helperText={props.touched.address && props.errors.address}
                          />
                        
                      </Grid>
                      <Grid item xs={12} className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Số điện thoại</InputLabel>
                            <TextField
                              name="phone"
                              id="outlined-full-width"
                              variant="outlined"
                              style={{ margin: 8 }}
                              placeholder="Nhập vào số điện thoại!"
                              fullWidth
                              multiline
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={props.values.phone}
                              onChange={(e) => handleFieldChange(e, props)}
                              error={
                                props.touched.phone && Boolean(props.errors.phone)
                              }
                              helperText={props.touched.phone && props.errors.phone}
                            />
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} className={ classes.gridColumn }>
                    <Grid item>
                      <Grid item xs={12} className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>Email</InputLabel>
                          <TextField
                            name="email"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            placeholder="Nhập vào email!"
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.email}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.email && Boolean(props.errors.email)
                            }
                            helperText={props.touched.email && props.errors.email}
                          />
                      </Grid>
                      <Grid item xs={12} className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Mã đối tượng</InputLabel>
                            <TextField
                              name="code"
                              id="outlined-full-width"
                              variant="outlined"
                              style={{ margin: 8 }}
                              placeholder="Nhập vào  mã đối tượng!"
                              fullWidth
                              multiline
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={props.values.code}
                              onChange={(e) => handleFieldChange(e, props)}
                              error={
                                props.touched.code && Boolean(props.errors.code)
                              }
                              helperText={props.touched.code && props.errors.code}
                            />
                        </Grid>
                      <Grid item xs={12} className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>Loại đối tượng</InputLabel>
                          <FormControl variant="outlined" fullWidth style={{ margin: 8}}>
                            <Select
                              id="select-contract-status"
                              name="participantType"
                              value={props.values.participantType || "Type 1"}
                              onChange={(e) => {
                                const { name, value } = e.target
                                props.setFieldValue(name, value)
                                props.setFieldTouched(name, true, false)
                              }}
                            >
                              <MenuItem value={"Type 1"}>Type 1</MenuItem>
                              <MenuItem value={"Type 2"}>Type 2</MenuItem>
                              <MenuItem value={"Type 3"}>Type 3</MenuItem>
                              <MenuItem value={"Type 4"}>Type 4</MenuItem>
                            </Select>
                          </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  size="small"
                  variant="contained"
                  className={classes.button}
                  onClick={handleClose}
                  color="default"
                >
                  Đóng
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  type="submit"
                >
                  Lưu
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}

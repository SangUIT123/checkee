import React, { useEffect, useState, Component, Fragment } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
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
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Formik, useFormik, Field, Form } from "formik";
import * as yup from "yup";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
//styles
import { useStyles, useRowStyles } from './Contract_Form.styles'
import DatePickerField from './DatePickerField'
import FormModal from 'Frontend/components/FormModal'

//api
// import { CONTRACT } from '../../constant.config.api/index';s

export default function Contract_Form(props){
  const classes = useStyles();
  const [openContractForm, setOpenContractForm] = React.useState(false);
  const [checkEdit, setCheckEdit] = React.useState(false);
  const [contract, setContract] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [contractStatus, setContractStatus] = React.useState(props.contract ? props.contract.contractStatus : "Chờ xử lý")
  const [packageBuy, setPackageBuy] = React.useState(props.contract ? props.contract.packageBuy : "Trial")
  const fileUploadEl = React.useRef(null)

  const initialFormValues = {
    orderNo: contract ? contract.orderNo : 1,
    customerId: contract ? contract.customerId : "",
    numberContract: contract ? contract.numberContract : "",
    nameContract: contract ? contract.nameContract : "",
    contractStatus: contract ? contract.contractStatus : "",
    date: contract ? contract.date : new Date(), // ngày ký
    startDay: contract ? contract.startDay : new Date(), // ngày có hiệu lực
    endDay: contract ? contract.endDay : new Date(), // ngày hết hiệu lực
    durationPay: contract ? contract.durationPay : new Date(),
    packageBuy: contract ? contract.packageBuy : "",
    contractValue: contract ? contract.contractValue : 0,
    vat: contract ? contract.vat : 0, // 0 -> 1
    vatPrice: contract ? (parseFloat(contract.contractValue) * parseFloat(contract.vat)).toFixed(5) : null, // tính toán từ contractValue * vat,
    publicKey: contract ? contract.publicKey : "",
    privateKey: contract ? contract.privateKey : "",
    fileDoc: contract ? contract.fileDoc : {},
  }

  useEffect(()=>{
    setCheckEdit(props.checkEdit)
  },[props.checkEdit])

  useEffect(()=>{
    setOpenContractForm(openContractForm)
  },[openContractForm])

  useEffect(()=>{
    setContract(props.contract)
  },[props.contract])

  const handleOpen = () => {
    setOpenModal(true);
    setOpenContractForm(true)
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenContractForm(false)
  };

  const handleCalcvatPrice = (e, { handleChange, setFieldTouched, values }) => {
    handleChange(e); 
    values.vatPrice = parseFloat(e.target.value) * values.contractValue
    setFieldTouched(e.target.name, true, false)
  }

  const handleFieldChange = (e, { handleChange, setFieldTouched }) => {
    handleChange(e)
    setFieldTouched(e.target.name, true, false)
  }

  const handleUploadFile = (e, parentProps) => {
    console.log(e.target.files[0])
    let file = e.target.files[0];
    let mimeType = 'pdf';
    if(file) {
      const reader = new FileReader()
      reader.onload = (readerEvt) => {
        let binaryString = readerEvt.target.result as string;
        let base64 = btoa(binaryString)
        //base64
        parentProps.setFieldValue('fileDoc', { name: file.name, chunk: base64})
      }
      reader.readAsBinaryString(file)
    }
  }
  
  const handleDownloadFile = (e, parentProps) => {
    const { fileDoc } = parentProps.values
    const linkSource = `data:application/pdf;base64,${fileDoc.chunk}`;
    console.log(linkSource)
    const downloadLink = document.createElement("a");
    const fileName = fileDoc.name;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const handleSubmit = async (values, { resetForm }) => {
    let updatedValues = { 
      ...values,
      contractStatus,
      packageBuy,
      contractValue: parseFloat(values.contractValue),
      vatPrice: parseFloat(values.vatPrice),
      startDay: values.startDay.toISOString(),
      endDay: values.endDay.toISOString(),
      date: values.date.toISOString(),
      durationPay: values.durationPay.toISOString(),
    }
    console.log(updatedValues)
    alert(JSON.stringify(updatedValues, null, 2))
  } 
  
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
        open={openContractForm}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="lg"
        scroll="body"
      >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Formik
          initialValues={initialFormValues}
          validationSchema={yup.object().shape({
            orderNo: yup.number().required('Trường STT là bắt buộc'),
            customerId: yup.string().required('Trường customerId là bắt buộc'),
            numberContract: yup.string().required('Trường số hợp đồng là bắt buộc'),
            nameContract: yup.string().required('Trường tên hợp đồng là bắt buộc'),
            contractStatus: yup.string().required('Trường trạng thái hợp đồng là bắt buộc'),
            date: yup.date().required('Trường ngày ký là bắt buộc'), // ngày ký
            startDay: yup.date().required('Trường ngày có hiệu lực là bắt buộc'), // ngày có hiệu lực
            endDay: yup.date().required('Trường ngày hết hiệu lực là bắt buộc'), // ngày hết hiệu lực
            durationPay: yup.date().required('Trường hạn thanh toán là bắt buộc'),
            packageBuy: yup.string().required('Trường loại hợp đồng là bắt buộc'),
            contractValue: yup.number().required('Trường giá trị hợp đồng là bắt buộc'),
            vat: yup.number().required('Trường % VAT là bắt buộc'), // 0 -> 1
            publicKey: yup.string().required('Trường chữ ký bên A là bắt buộc'),
            privateKey: yup.string().required('Trường chữ ký bên B là bắt buộc'),
            fileDoc: yup.object().nullable().required('Trường file văn bản là bắt buộc'),
          })}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <DialogTitle
                id="form-dialog-title"
                className={classes.dialogTitle}
              >
                {!checkEdit
                  ? "Thêm mới hợp đồng"
                  : "Cập nhật hợp đồng"}
              </DialogTitle>
              <DialogContent>
                <Grid container>
                  <Grid item xs={12} sm={6}  className={ classes.gridColumn }>
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
                        Số hợp đồng
                      </InputLabel>
                        <TextField
                          name="numberContract"
                          id="outlined-full-width"
                          variant="outlined"
                          style={{ margin: 8 }}
                          placeholder="Nhập vào số hợp đồng!"
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={props.values.numberContract}
                          onChange={(e) => handleFieldChange(e, props)}
                          error={
                            props.touched.numberContract && Boolean(props.errors.numberContract)
                          }
                          helperText={props.touched.numberContract && props.errors.numberContract}
                        />
                    </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="status-label-control"  style={{ marginLeft : "10px"}}>Trạng thái</InputLabel>
                          <FormControl variant="outlined" fullWidth style={{ margin: 8}}>
                            <Select
                              id="select-contract-status"
                              value={contractStatus}
                              onChange={(e) => setContractStatus(e.target.value as string)}
                            >
                              <MenuItem value={"Chờ xử lý"}>Chờ xử lý</MenuItem>
                              <MenuItem value={"Đang xử lý"}>Đang xử lý</MenuItem>
                              <MenuItem value={"Đã xử lý"}>Đã xử lý</MenuItem>
                              <MenuItem value={"Đã thanh toán"}>Đã thanh toán</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Ngày có hiệu lực</InputLabel>
                          <Field
                            name="startDay"
                            validate={value => {
                              if (new Date(value) < new Date(props.values.date)) {
                                return "Ngày có hiệu lực phải lớn hơn ngày ký";
                              }
                            }}
                            component={DatePickerField}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Hạn thanh toán</InputLabel>
                          <Field
                            name="durationPay"
                            validate={value => {
                              if (new Date(value) < new Date(props.values.date)) {
                                return "Hạn thanh toán phải lớn hơn ngày ký";
                              }
                            }}
                            component={DatePickerField}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Giá trị hợp đồng</InputLabel>
                          <TextField
                          name="contractValue"
                          id="contractValue"
                          variant="outlined"
                          style={{ margin: 8 }}
                          placeholder="Nhập vào số thứ tự!"
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          type="number"
                          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                          value={props.values.contractValue}
                          onChange={(e) => handleFieldChange(e, props)}
                          error={
                            props.touched.contractValue &&
                            Boolean(props.errors.contractValue)
                          }
                          helperText={
                            props.touched.contractValue && props.errors.contractValue
                          }
                        />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>VAT price</InputLabel>
                          <TextField
                            disabled
                            name="vatPrice"
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
                            value={props.values.vatPrice}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.vatPrice &&
                              Boolean(props.errors.vatPrice)
                            }
                            helperText={
                              props.touched.vatPrice && props.errors.vatPrice
                            }
                          />
                      </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Chữ ký Bên B</InputLabel>
                            <TextField
                              name="privateKey"
                              id="outlined-full-width"
                              variant="outlined"
                              style={{ margin: 8 }}
                              fullWidth
                              multiline
                              margin="normal"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={props.values.privateKey}
                              onChange={(e) => handleFieldChange(e, props)}
                              error={
                                props.touched.privateKey && Boolean(props.errors.privateKey)
                              }
                              helperText={props.touched.privateKey && props.errors.privateKey}
                            />
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}  className={ classes.gridColumn }>
                     <Grid item>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Tên hợp đồng</InputLabel>
                          <TextField
                            size="medium"
                            name="nameContract"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.nameContract}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.nameContract && Boolean(props.errors.nameContract)
                            }
                            helperText={props.touched.nameContract && props.errors.nameContract}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Tên đối tác</InputLabel>
                          <TextField
                            size="medium"
                            name="customerId"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.customerId}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.customerId && Boolean(props.errors.customerId)
                            }
                            helperText={props.touched.customerId && props.errors.customerId}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Ngày ký</InputLabel>
                          <Field
                            name="date"
                            component={DatePickerField}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Ngày hết hiệu lực</InputLabel>
                          <Field
                            name="endDay"
                            validate={value => {
                              if (new Date(value) < new Date(props.values.startDay)) {
                                return "Ngày hết hiệu lực phải lớn hơn ngày có hiệu lực";
                              }
                            }}
                            component={DatePickerField}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="status-label-control"  style={{ marginLeft : "10px"}}>Loại hợp đồng</InputLabel>
                          <FormControl variant="outlined" fullWidth style={{ margin: 8}}>
                            <Select
                              id="select-contract-type"
                              value={packageBuy}
                              onChange={(e) => setPackageBuy(e.target.value as string)}
                            >
                              <MenuItem value={"Trial"}>Trial</MenuItem>
                              <MenuItem value={"Standard"}>Standard</MenuItem>
                              <MenuItem value={"Premium"}>Premium</MenuItem>
                              <MenuItem value={"Enterprise"}>Enterprise</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                        <InputLabel id="" style={{ marginLeft : "10px"}}>% VAT</InputLabel>
                        <TextField
                          name="vat"
                          id="vat"
                          variant="outlined"
                          style={{ margin: 8 }}
                          placeholder="Nhập vào số thứ tự!"
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          type="number"
                          InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
                          value={props.values.vat}
                          onChange={(e) => handleCalcvatPrice(e,props)}
                          error={
                            props.touched.vat &&
                            Boolean(props.errors.vat)
                          }
                          helperText={
                            props.touched.vat && props.errors.vat
                          }
                        />
                      </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                          <InputLabel id="" style={{ marginLeft : "10px"}}>Chữ ký Bên A</InputLabel>
                          <TextField
                            name="publicKey"
                            id="outlined-full-width"
                            variant="outlined"
                            style={{ margin: 8 }}
                            fullWidth
                            multiline
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={props.values.publicKey}
                            onChange={(e) => handleFieldChange(e, props)}
                            error={
                              props.touched.publicKey && Boolean(props.errors.publicKey)
                            }
                            helperText={props.touched.publicKey && props.errors.publicKey}
                          />
                        </Grid>
                        <Grid item xs={12}  className={classes.gridItem}>
                            <Grid container direction="row" justify="center" alignItems="center">
                              <Grid item sm={11}>
                                <InputLabel id="" style={{ marginLeft : "10px"}}>
                                  File văn bản (Chọn để thay đổi)
                                </InputLabel>
                                <TextField
                                  name="fileDoc"
                                  id="fileDoc"
                                  variant="outlined"
                                  fullWidth
                                  style={{ margin: 8 }}
                                  multiline
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  value={props.values.fileDoc?.name}
                                  onClick={() => { console.log(fileUploadEl.current.click())}}
                                  error={
                                    props.touched.fileDoc && Boolean(props.errors.fileDoc)
                                  }
                                  helperText={props.touched.fileDoc && props.errors.fileDoc}
                                />
                                <input
                                  accept="application/pdf"
                                  ref={fileUploadEl}
                                  type="file"
                                  style={{ display: 'none'}}
                                  onChange={(e) => handleUploadFile(e,props)}
                                />
                            </Grid>
                              <Grid item sm={1}>
                                <IconButton style={{ margin: 8}} onClick={(e) => handleDownloadFile(e, props)}>
                                  <GetAppRoundedIcon/>
                                </IconButton>
                              </Grid>
                            </Grid>
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
            </Form>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}

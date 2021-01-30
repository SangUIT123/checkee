import React, { useEffect, useState, Component} from 'react'
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import {
  DataGrid,
  ColDef,
  ValueGetterParams,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableFooter from "@material-ui/core/TableFooter";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
// import { getContractStart, deleteContractStart, IContract } from 'Frontend/redux/actions/ContractActions'

//
import Contract_Form from './Contract_Form'
import { useStyles, useStyles1 } from './Contract.styles'
import {  checkAccessRight,  ISystemUserTypePageAccessRight} from "../../redux/actions/SystemUserTypePageActions";
import { IUserProfile } from "../../redux/actions/LoginActions";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number
  ) => void;
}


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

interface ContractProps {
  orderNo: Number,
  customerId: String,
  numberContract: String,
  nameContract: String,
  contractStatus: String,
  date: Date, // ngày ký
  startDay: Date, // ngày có hiệu lực
  endDay: Date, // ngày hết hiệu lực
  durationPay: Date,
  packageBuy: String,
  contractValue: String,
  vat: Number, // 0 -> 1
  vatPrice: String, // tính toán từ contractValue * vat,
  publicKey: String,
  privateKey: String,
  fileDoc: {
    name: String,
    chunk: String
  }
}

function Contract() {
  const classes = useStyles();
  // const contractData: IContract[] = useSelector((state: any) => state.Contract.contractData) || []
  const [ContractList, setContractList] = useState(null);
  const [Contract, setContract] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openContractForm, setOpenContractForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openCertificatesDialog, setOpenCertificatesDialog] = React.useState(false);
  const [selectedCertificates, setSelectedCertificates] = React.useState([]);


  // ====================================== ACCESSRIGHT ===================================//
  const [accessRightData, setAccessRightData] = React.useState([]);
  const [checkCreateContract, setCheckCreateContract] = React.useState(false);
  const [checkUpdateContract, setCheckUpdateContract] = React.useState(false);
  const [checkDeleteContract, setCheckDeleteContract] = React.useState(false);
 const dispatch = useDispatch();
 
const state_getuserlogindata: IUserProfile = useSelector(
(state: any) => state.Login.getuserlogindata
); 
const state_accessRightData: ISystemUserTypePageAccessRight[] = useSelector(
(state: any) => state.SystemUserTypePage.accessRightData
);
  
  let locationUrl = null;
  if (typeof window !== "undefined") {
    locationUrl = window.location.pathname.replace("/", "");
  }
  
let value = {
userId: state_getuserlogindata["_id"],
controllerName: locationUrl,
actionName: ["createContract", "updateContract", "deleteContract"],
};

useEffect(() => {
dispatch(checkAccessRight(value));
}, [dispatch]);

useEffect(()=>{
setAccessRightData(state_accessRightData)
},[state_accessRightData!])

  useEffect(() => {
    if (accessRightData) {
      for (let accessRight of accessRightData) {
        if (accessRight["controllerName"] === locationUrl) {
          if (accessRight["actionName"] === "createContract") {
            setCheckCreateContract(accessRight["checkAccessRight"]);
          } else if (accessRight["actionName"] === "updateContract") {
            setCheckUpdateContract(accessRight["checkAccessRight"]);
          } else if (accessRight["actionName"] === "deleteContract") {
            setCheckDeleteContract(accessRight["checkAccessRight"]);
          }
        }
      }
    }
  }, [accessRightData]);

  // ====================================== ACCESSRIGHT ===================================//

  // useEffect(() => {
  //   async function fetchContract() {
  //     console.log("begin fetch")
  //     await axios.get(CONTRACT).then(res => console.log("result: ", res)).catch(err => console.log("error: ", err))
  //   }

  //   fetchContract()
  // }, [])

  const rows: Array<ContractProps> = [{
    orderNo: 1,
    customerId: "176e54b9-5700-4728-bd83-c58290991594",
    numberContract: "50544-304",
    nameContract: "Contract_1",    
    contractStatus: "Đang xử lý",    
    date: new Date(1611119498922),
    startDay: new Date(1611793852729),
    endDay: new Date(1612915208775),
    durationPay: new Date(1618266336632),
    packageBuy: "Trial",
    contractValue: "18614.23",
    vat: 0.6,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "sample.pdf",
      chunk: "JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg=="
    }
  }, {
    orderNo: 2,
    customerId: "a1abd2ce-029c-4e8e-bb37-ec88361bb32e",
    numberContract: "0574-0805",
    nameContract: "Contract_2",    
    contractStatus: "Đang xử lý",    
    date: new Date(1603111635089),
    startDay: new Date(1611250478362),
    endDay: new Date(1614474796154),
    durationPay: new Date(1612689682389),
    packageBuy: "Standard",
    contractValue: "97249.80",
    vat: 0.9,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "MassaDonecDapibus.mov",
      chunk: ''
    }
  }, {
    orderNo: 3,
    customerId: "821cc7c9-8524-4046-8d9d-2a6ed63f773a",
    numberContract: "55154-5667",
    nameContract: "Contract_3",
    contractStatus: "Đang xử lý",
    date: new Date(1595099755821),
    startDay: new Date(1617254164523),
    endDay: new Date(1613163660429),
    durationPay: new Date(1616160178058),
    packageBuy: "Standard",
    contractValue: "70920.63",
    vat: 0.0,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "Nec.avi",
      chunk: ''
    }
  }, {
    orderNo: 4,
    customerId: "b5bc3c30-6b64-4986-bc47-c5fa142cbd94",
    numberContract: "11523-7170",
    nameContract: "Contract_4",
    contractStatus: "Đang xử lý",
    date: new Date(1599999565345),
    startDay: new Date(1616372765412),
    endDay: new Date(1618678872103),
    durationPay: new Date(1611879189823),
    packageBuy: "Standard",
    contractValue: "83340.33",
    vat: 0.6,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "EgestasMetus.mp3",
      chunk: ''
    }
  }, {
    orderNo: 5,
    customerId: "d70098c7-807c-4d1c-aa6d-97cd0a86e35a",
    numberContract: "55154-4559",
    nameContract: "Contract_5",
    contractStatus: "Đang xử lý",
    date: new Date(1591993003600),
    startDay: new Date(1614047492807),
    endDay:new Date(1612986342357),
    durationPay:new Date(1611919079587),
    packageBuy: "Standard",
    contractValue: "59602.85",
    vat: 0.5,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "NecCondimentumNeque.mp3",
      chunk: ''
    }
  }, {
    orderNo: 6,
    customerId: "52b9985e-a43f-427e-87df-f10d9390944b",
    numberContract: "54868-4577",
    nameContract: "Contract_6",
    contractStatus: "Đang xử lý",
    date: new Date(1596665571718),
    startDay: new Date(1614082267488),
    endDay: new Date(1618157054987),
    durationPay: new Date(1614435727222),
    packageBuy: "Enterprise",
    contractValue: "11255.69",
    vat: 0.2,
    vatPrice: '10000',
    publicKey: 'Chữ ký bên A',
    privateKey: 'Chữ ký bên B',
    fileDoc: {
      name: "UtAt.mov",
      chunk: ''
    }
  }]
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ------------------------------------------- handle Delete Dialog ----------------------------------- //
  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(false);
    setContractList;
    handleClickOpenSuccessAlert();
  };
  // ------------------------------------------- handle Delete Dialog ----------------------------------- //
  // ------------------------------------------- handle Toggle Certificates Menu ----------------------------------- //
  const handleOpenCertificatesDialog = (certs) => {
    setSelectedCertificates(certs)
    setOpenCertificatesDialog(!openCertificatesDialog)
  }

  const handleCloseCertificatesDialog = () => {
    setOpenCertificatesDialog(!openCertificatesDialog);
  };
  // ------------------------------------------- handle Toggle Certificates Menu ----------------------------------- //

  // ------------------------------------------- handle Alert ------------------------------------------- //
  const handleClickOpenSuccessAlert = () => {
    setOpenSuccessAlert(true);
  };

  const handleCloseSuccessAlert = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessAlert(false);
  };

  const handleClickOpenErrorAlert = () => {
    setOpenErrorAlert(true);
  };

  const handleCloseErrorAlert = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorAlert(false);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  // ------------------------------------------- handle Alert ------------------------------------------- //

  const handleClickOpenContractForm = () => {
    setOpenContractForm(true);
  };

  const handleClickCloseContractForm = () => {
    setOpenContractForm(false);
  };

  // console.log("+++++++++++++++++++++++++++++++++++UserType")
  // console.log("openDeleteDialog",openDeleteDialog);
  // console.log("userType",userType)

  return (
    <div className="main-content">
      <Card className={classes.root}>
        <div className="row">
          <Grid container>
            <Grid item xs={10}>
              <CardHeader title="Quản lý hợp đồng" />
            </Grid>
            <Grid item xs>
              <CardActions>
              {checkCreateContract ? (
                <Contract_Form
                  checkEdit={false}
                />
              ) : null}
              
              </CardActions>
            </Grid>
          </Grid>
        </div>
      </Card>
      <div style={{ height: 400, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <TableContainer component={Paper} >
              <Table
                className={classes.table}
                aria-label="simple pagination table"
                style={{ overflowX: 'scroll'}}
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRightBorder}>
                      STT
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Số hợp đồng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Tên hợp đồng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Ngày ký
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Ngày có hiệu lực
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Ngày hết hiệu lực                     
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Hạn thanh toán
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Loại hợp đồng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Giá trị hợp đồng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      % VAT
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      tiền VAT
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Chữ ký bên A
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Chữ ký bên B
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Trạng thái
                    </TableCell>
                    <TableCell className={classes.tableRightBorder} style={{ width: 150 }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows !== null
                    ? (rowsPerPage > 0
                        ? rows.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : rows
                      ).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.orderNo}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            <a href="#">{row.numberContract}</a>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.nameContract}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.date.toLocaleString().split(',')[0]}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.startDay.toLocaleString().split(',')[0]}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.endDay.toLocaleString().split(',')[0]}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.durationPay.toLocaleString().split(',')[0]}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.packageBuy}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.contractValue}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.vat}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.vatPrice}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.publicKey}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.privateKey}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.contractStatus}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {checkUpdateContract ? (
                              <Contract_Form checkEdit={true} contract={row} />
                            ) : null}
                            {checkDeleteContract ? (
                              <Tooltip title="Xóa" placement="top-start">
                              <IconButton
                                className={classes.iconButton}
                                aria-label="delete"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  setContract(row);
                                  handleClickOpenDeleteDialog();
                                }}
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                            ) : null}  
                          </TableCell>
                        </TableRow>
                      ))
                    : ""}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                      colSpan={12}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      labelDisplayedRows={({ from, to, count }) =>
                        `Đang xem ${from} đến ${to} trong tổng số ${count} mục`
                      }
                      labelRowsPerPage={"Hàng mỗi trang"}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      {/*----------------------------------Dialog certificates---------------------------------- */}
      <Dialog
        open={openCertificatesDialog}
        onClose={handleCloseCertificatesDialog}
        aria-labelledby="cert-dialog-title"
        fullWidth
        maxWidth="sm"
        scroll="body"
      >
        <DialogTitle id="simple-dialog-title">Chứng chỉ</DialogTitle>
        <DialogContent>
        </DialogContent>
      </Dialog>
      {/*----------------------------------Dialog Xóaa---------------------------------- */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>
              Bạn có chắc chắn muốn xóa "<b>{Contract?.name}"</b>?
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="default">
            Thoát
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------------------------Alert----------------------------------- */}
      <Snackbar
        open={openSuccessAlert}
        autoHideDuration={4000}
        onClose={handleCloseSuccessAlert}
      >
        <Alert onClose={handleCloseSuccessAlert} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorAlert}
        autoHideDuration={4000}
        onClose={handleCloseErrorAlert}
      >
        <Alert onClose={handleCloseErrorAlert} severity="error">
          This is an error message!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Contract;

import React, { useEffect, useState, Component } from "react";
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
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
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
//
import Participant_Form from "./Participant_Form";
import { useStyles, useStyles1 } from "./Participant.styles";
import {
  checkAccessRight,
  ISystemUserTypePageAccessRight,
} from "../../redux/actions/SystemUserTypePageActions";
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

interface ParticipantProps {
  id: Number;
  orderNo: Number;
  participantName: String;
  code: String;
  address: String;
  phone: String;
  email: String;
  participantType: String;
}

function Participant() {
  const classes = useStyles();
  const [participantList, setParticipantList] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openParticipantForm, setOpenParticipantForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ======================================== ACCESSRIGHT ============================================//
  const [accessRightData, setAccessRightData] = React.useState([]);
  const [checkCreateParticipant, setCheckCreateParticipant] = React.useState(
    false
  );
  const [checkUpdateParticipant, setCheckUpdateParticipant] = React.useState(
    false
  );
  const [checkDeleteParticipant, setCheckDeleteParticipant] = React.useState(
    false
  );
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
    actionName: ["createParticipant", "updateParticipant", "deleteParticipant"],
  };

  useEffect(() => {
    dispatch(checkAccessRight(value));
  }, [dispatch]);

  useEffect(() => {
    setAccessRightData(state_accessRightData);
  }, [state_accessRightData!]);

  useEffect(() => {
    if (accessRightData) {
      for (let accessRight of accessRightData) {
        if (accessRight["controllerName"] === locationUrl) {
          if (accessRight["actionName"] === "createParticipant") {
            setCheckCreateParticipant(accessRight["checkAccessRight"]);
          } else if (accessRight["actionName"] === "updateParticipant") {
            setCheckUpdateParticipant(accessRight["checkAccessRight"]);
          } else if (accessRight["actionName"] === "deleteParticipant") {
            setCheckDeleteParticipant(accessRight["checkAccessRight"]);
          }
        }
      }
    }
  }, [accessRightData]);

  // ======================================== ACCESSRIGHT ============================================//

  // useEffect(() => {
  //   setUserType;
  // }, [userType]);

  const rows: Array<ParticipantProps> = [
    {
      id: Math.random(),
      code: "code_1",
      orderNo: 1,
      participantName: "Francklin Malby",
      address: "48056 Stang Trail",
      phone: "475-90-3484",
      participantType: "Type 1",
      email: "fmalby0@desdev.cn",
    },
    {
      id: Math.random(),
      code: "code_1",
      orderNo: 2,
      participantName: "Barb Sanzio",
      address: "8365 Holy Cross Street",
      phone: "619-10-8703",
      participantType: "Type 1",
      email: "bsanzio1@live.com",
    },
    {
      id: Math.random(),
      code: "code_1",
      orderNo: 3,
      participantName: "Jayme Janaud",
      address: "153 Tony Plaza",
      phone: "486-62-8594",
      participantType: "Type 1",
      email: "jjanaud2@rakuten.co.jp",
    },
    {
      id: Math.random(),
      code: "code_1",
      orderNo: 4,
      participantName: "Helaine Garrelts",
      address: "3 Burrows Point",
      phone: "225-70-1246",
      participantType: "Type 1",
      email: "hgarrelts3@icq.com",
    },
    {
      id: Math.random(),
      orderNo: 5,
      participantName: "Gale Shee",
      code: "code_1",
      participantType: "Type 1",
      address: "8 Stang Circle",
      phone: "478-31-5522",
      email: "gshee4@webnode.com",
    },
    {
      id: Math.random(),
      code: "code_1",
      orderNo: 6,
      participantName: "Myrah MacCulloch",
      address: "80 Grayhawk Court",
      phone: "663-48-2559",
      participantType: "Type 1",
      email: "mmacculloch5@t-online.de",
    },
  ];

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
    handleClickOpenSuccessAlert();
  };
  // ------------------------------------------- handle Delete Dialog ----------------------------------- //

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

  const handleClickOpenParticipantForm = () => {
    setOpenParticipantForm(true);
  };

  const handleClickCloseParticipantForm = () => {
    setOpenParticipantForm(false);
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
              <CardHeader title="Quản lý đối tượng tham gia" />
            </Grid>
            <Grid item xs>
              <CardActions>
                {checkCreateParticipant ? (
                  <Participant_Form checkEdit={false} />
                ) : null}
              </CardActions>
            </Grid>
          </Grid>
        </div>
      </Card>
      <div style={{ height: 400, width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                aria-label="simple pagination table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRightBorder}>
                      STT
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Tên đối tượng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Mã đối tượng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Loại đối tượng
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Địa chỉ
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Số điện thoại
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
                      Email
                    </TableCell>
                    <TableCell className={classes.tableRightBorder}>
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
                            {row.participantName}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.code}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.participantType}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.address}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.phone}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {row.email}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableRightBorder}
                          >
                            {checkUpdateParticipant ? (
                              <Participant_Form
                                checkEdit={true}
                                participant={row}
                              />
                            ) : null}
                            {checkDeleteParticipant ? (
                              <Tooltip title="Xóa" placement="top-start">
                                <IconButton
                                  className={classes.iconButton}
                                  aria-label="delete"
                                  size="small"
                                  color="secondary"
                                  onClick={() => {
                                    setParticipant(row);
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
                      colSpan={8}
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
              Bạn có chắc chắn muốn xóa "<b>{participant?.name}"</b>?
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

export default Participant;

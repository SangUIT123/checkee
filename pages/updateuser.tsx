import UpdateUser from "@/ListUser/UpdateUser";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Main from "@/Main/Main";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);
const UpdateUsers = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Main />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
          <UpdateUser />
        </div>
      </main>
    </div>
  );
};

export default UpdateUsers;

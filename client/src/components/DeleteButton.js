import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function DeleteButton(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.handleClose();
  };
  const handleDelete = () => {
    axios({
        method: 'delete',
        url: `http://127.0.0.1:8000/api/posts/${props.post.id}`,
        withCredentials: true,
        config: { headers: { 'Content-Type': 'application/json' } }
    })
        .then(function (response) {
            //handle success
            let { data } = response;
            console.log(data);
            window.location.href = window.location.href;
        })
        .catch(function (error) {
            //handle error
        });
  }
  return (
    <div>
      <MenuItem onClick={handleClickOpen}>
        Delete
      </MenuItem>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Confirm Delete
        </DialogTitle>
        <DialogContent dividers>
            <Paper style={{ width: "50%", margin: "5% auto" }}>
                <Typography variant="h3">
                    Are you sure you want to delete this post?
                </Typography>
               <Button style={{ marginTop: "2%" }} onClick={handleDelete} variant="contained" size="large" color="primary">Yes, Delete Post</Button>
               <Button style={{ marginTop: "2%" }} onClick={handleClose} variant="contained" size="large" color="secondary">Cancel</Button>
            </Paper>
        </DialogContent>
      </Dialog>
    </div>
  );
}

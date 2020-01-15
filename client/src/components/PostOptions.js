import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    }
}));

export default function PostOptions(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        if (event === undefined) {
            setOpen(false);
            return;
        } else if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <IconButton
                ref={anchorRef}
                aria-controls={open ? 'settings' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <MoreVertIcon />
            </IconButton>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                            <Paper>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <EditButton handleClose={event => handleClose(event)} post={props.post} />
                                    <DeleteButton handleClose={event => handleClose(event)} post={props.post} />
                                    <MenuItem onClick={handleClose}>Report Post</MenuItem>
                                </MenuList>
                            </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

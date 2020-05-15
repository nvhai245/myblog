import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { authorize } from '../redux/actions/authorize';
import LoginForm from '../components/LoginForm';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

function Login(props) {
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState(false);
    const handleAuthorize = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/restricted',
            withCredentials: true
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    };
    const handleLogin = value => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/login',
            data: value,
            withCredentials: true,
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then(function (response) {
                //handle success
                setErrorMessage(false);
                let { data } = response;
                props.authorize(data);
                
            })
            .catch(function (error) {
                //handle error
                if (error.response.status == 401) {
                    setErrorMessage(true);
                }
            });
    };
    return (
        <div>
            <Paper className={classes.root} style={{ width: "35%", margin: "5% auto" }}>
                <LoginForm onSubmit={handleLogin} />
                {errorMessage && 
                <Typography style={{color: "red"}} variant="caption" gutterBottom align="right">
                    Wrong Email or Password!
                </Typography>
                }
            </Paper>
        </div>
    )
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    authorize: data => dispatch(authorize(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)

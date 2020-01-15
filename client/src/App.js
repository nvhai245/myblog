import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, About, Users } from './routes';
import Login from './routes/login';
import NotFound from './components/NotFound';
import { Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import New from './routes/new';
import { connect } from 'react-redux';
import logo from './assets/blog4.png';
import space from './assets/space.svg';
const useStyles = makeStyles(theme => ({
  root: {
    overflow: "auto",
    width: "100%",
  },
  appBody: {
    position: "absolute",
    zIndex: 1000,
    top: 0,
    left: 0,
    width: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  }
}));

function App(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.canvas}>
        <div className="content content--canvas">
          <Router>
            <div className={classes.appBody}>
              <AppBar position="static" style={{ backgroundColor: "#93afd9", padding: 0 }}>
                <Toolbar variant="dense">
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                  <Button color="inherit" component={Link} to="/">
                    <img style={{ height: "8vh" }} src={logo} alt="" />
                  </Button>
                  <div style={{ marginLeft: "auto", display: "flex", marginRight: "3%" }}>
                    {props.authorization.authorized &&
                      <Button color="inherit" component={Link} to="/new">
                        New post
                </Button>
                    }
                    <Button color="inherit" component={Link} to="/about">
                      About
              </Button>
                    {props.authorization.admin &&
                      <Button color="inherit" component={Link} to="/api/users">
                        Users
                </Button>
                    }
                    {props.authorization.authorized ?
                      <div>
                        <Button color="inherit" component={Link} to="#">
                          <img style={{ height: "5vh", marginRight: "0.5vw" }} src={props.authorization.avatar} alt="" />
                          {props.authorization.username}
                        </Button>
                      </div> :
                      <div>
                        <Button color="inherit" component={Link} to="/login">
                          Login
                  </Button>
                        <Button color="inherit" component={Link} to="/signup">
                          Register
                  </Button>
                      </div>
                    }
                  </div>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route exact path="/new">
                  <New />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/about">
                  <About />
                </Route>
                <Route exact path="/users">
                  <Users />
                </Route>
                <Route exact path='/404'>
                  <NotFound />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Redirect from='*' to='/404' />
              </Switch>
            </div>
          </Router>
        </div>
      </div>

    </div>
  );
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);

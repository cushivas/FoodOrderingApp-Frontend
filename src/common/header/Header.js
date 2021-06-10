import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import {withStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { Link } from 'react-router-dom';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const headerStyles = theme => ({
    grow: {
      flexGrow: 1
    },
    search: {
      position: 'relative',
      margin: theme.spacing(1),
      width: '300px',
    },
    searchIcon: {
      width: theme.spacing.unit * 4,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color:'#fff'
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 4,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200
        }
      }
    },
    avatar: {
      width: 50,
      height: 50,
    },
    appHeader:{
      backgroundColor:'#263238'
    },
    hr:{
      height:'1.5px',
      backgroundColor:'#f2f2f2',
      marginLeft:'5px',
      marginRight:'5px'
    },
    margin: {
        margin: theme.spacing(1),
    },
  })
  



class Header extends Component {
    constructor(){
        super();
        this.state = {};
    }

     onClickHandler = (event) =>{ 
        this.setState({
          anchorEl: event.currentTarget
        })
      }
    
      onAccountClickHandler = ()=>{
        this.props.handleAccount();
        this.onCloseButtonClickHandler();
      }
    
      onLogoutButtonClickHandler = ()=>{
        this.props.handleLogout();
        this.onCloseButtonClickHandler();
      }
    
      onCloseButtonClickHandler = () =>{
        this.setState({ anchorEl: null });
      }


      render(){
        const {classes,screen} = this.props;
        return (<div>
            <AppBar className={classes.appHeader}>
              <Toolbar>
                {(screen === "Login" || screen === "Home") && <FastfoodIcon fontSize="large" style={{color:'whitesmoke'}}></FastfoodIcon>}
                {(screen === "Profile") && <Link style={{ textDecoration: 'none', color: 'white' }} to="/home"><span className="header-logo">Image Viewer</span></Link>}
                <div className={classes.grow}/>
                {(screen === "Home") &&
                  <TextField
                  className={classes.search}
                  id="input-with-icon-textfield"
                  placeholder="Search by Restaurant Name" 
                  onChange={(e)=>{this.props.searchHandler(e.target.value)}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{color:'#fff'}}/>
                      </InputAdornment>
                    ),
                  }}
                />
                }
                {(screen === "Home1" || screen === "Profile")  &&
                  <div>
                    <IconButton onClick={this.onClickHandler}>
                      <Avatar alt="Profile Pic" src={this.props.userProfileUrl} className={classes.avatar} style={{border: "1px solid #fff"}}/>
                    </IconButton>
                    <Popover
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.onCloseButtonClickHandler}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}>
                        <div style={{padding:'5px'}}>
                          { (screen === "Home") &&
                            <div>
                              <MenuItem onClick={this.onAccountClickHandler}>My Account</MenuItem>
                              <div className={classes.hr}/>
                            </div>
                          }
                          <MenuItem onClick={this.onLogoutButtonClickHandler}>Logout</MenuItem>
                        </div>
                    </Popover>
                  </div>
                }
              </Toolbar>
            </AppBar>
        </div>)
      }
    

    /* render() {
        return(
            <div className="header-container">
                <div>
                    <FastfoodIcon fontSize="large" style={{color:'whitesmoke'}}></FastfoodIcon>
                </div>
            </div>
        )
    } */
}

export default withStyles(headerStyles)(Header)
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search'; //AccountCircle
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { InputLabel } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import './Header.css'
import Utility from '../Utility'
import HTTPRequestHandler from '../Http-handler';
import Snackbar from '@material-ui/core/Snackbar';


/**
 *  Header Styles
 * @param {*} theme 
 * @returns 
 */

const headerStyles = theme => ({

  headerroot: {
    minHeight:64,
    [theme.breakpoints.down('xs')]: {
      minHeight: 140,
      maxHeight:145,
    }
  },
  headerroot2: {
    minHeight:64,
    [theme.breakpoints.down('xs')]: {
      minHeight: 100,
      maxHeight:100,
    }
  },
  grow: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    [theme.breakpoints.down('xs')]: {
      flexDirection: "column",
      alignItems:"flex-start"
      
    }
  },
  search: {
    position: 'relative',
    margin: theme.spacing(1),
    width: '300px',
  },
  appHeader: {
    backgroundColor: '#263238',
  },
  hr: {
    height: '1.5px',
    backgroundColor: '#f2f2f2',
    marginLeft: '5px',
    marginRight: '5px'
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  searchInput: {
    '&::placeholder': {
      color: '#fff',
    },
    color: "#fff",
  },

  loginModal: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400
  }

})

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 310
  }
};
/**
 * 
 * @param {*} props 
 * @returns 
 */
const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: '0.5rem', textAlign: 'center' }}>
      {props.children}
    </Typography>
  )
}

/**
 * 
 */
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}


class Header extends Component {

  loggedInUserData = null;

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      tabIndex: 0,
      phoneNumber: '',
      phoneNumberRequired: 'dispNone',
      phoneNumberInvalid: 'dispNone',
      password: '',
      passwordRequired: 'dispNone',
      passwordInvalid: 'dispNone',
      notRegistered: 'dispNone',
      firstname: '',
      firstnameRequired: 'dispNone',
      lastname: '',
      email: '',
      emailRequired: 'dispNone',
      invalidEmail: 'dispNone',
      registrationPassword: '',
      registrationPasswordRequired: 'dispNone',
      registrationPasswordInvalid: 'dispNone',
      registrationPhone: '',
      registrationPhoneRequired: 'dispNone',
      registrationPhoneInvalid: 'dispNone',
      showSnackbar: false,
      snackbarMessage: '',
      registrationFailedMessage: '',
      registrationFailed: 'dispNone',
      loggedIn: false,
      showLoginError: 'dispNone',
      loginErrorMessage: '',
      loggedInUserFirstName:''
    };
  }

  componentDidMount(){
    if(sessionStorage.getItem('access-token') !== null && sessionStorage.getItem('first_name') !== null) {
        // User already logged in
        this.setState({
          loggedIn: true,
          loggedInUserFirstName:sessionStorage.getItem('first_name')
        })
    }
  }

  onClickHandler = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  onAccountClickHandler = () => {
    this.navigateToProfile();
    this.onCloseButtonClickHandler();
  }

  onLogoutButtonClickHandler = () => {
    this.processLogout();
    this.onCloseButtonClickHandler();
  }

  /**
   *  Logout the user and empty the session storage data
   */
  processLogout = () => {
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                sessionStorage.removeItem('access-token');
                sessionStorage.removeItem('uuid');
                sessionStorage.removeItem('first_name');
                self.setState({   loggedIn: false,
                loggedInUserFirstName:'' });
                if(self.props.screen === "Checkout") {
                  this.navigateToHome();
                }
            }
        });
        let url = this.props.baseUrl + 'customer/logout';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
  }

  /**
   *  Navigate to Profile page 
   */
  navigateToProfile= () =>{
    this.props.history.push({
      pathname: '/profile/',
    })
  }

  onCloseButtonClickHandler = () => {
    this.setState({ anchorEl: null });
  }
  /**
   *  Open Login/Register Modal and set initialize properties
   */
  openModalHandler = () => {
    this.setState({
      modalIsOpen: true,
      tabIndex: 0,
      phoneNumber: '',
      phoneNumberRequired: 'dispNone',
      phoneNumberInvalid: 'dispNone',
      password: '',
      passwordRequired: 'dispNone',
      passwordInvalid: 'dispNone',
      notRegistered: 'dispNone',
      firstname: '',
      firstnameRequired: 'dispNone',
      lastname: '',
      email: '',
      emailRequired: 'dispNone',
      invalidEmail: 'dispNone',
      registrationPassword: '',
      registrationPasswordRequired: 'dispNone',
      registrationPasswordInvalid: 'dispNone',
      registrationPhone: '',
      registrationPhoneRequired: 'dispNone',
      registrationPhoneInvalid: 'dispNone',
      showSnackbar: false,
      snackbarMessage: '',
      registrationFailedMessage: '',
      registrationFailed: 'dispNone',
      showLoginError: 'dispNone',
      loginErrorMessage: ''
    })
  }

  /**
   * close login/register modal 
   */
  closeModalHandler = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  /**
   * Tab change Event Handler
   * @param {*} evt 
   * @param {*} value 
   */

  tabChangeHandler = (evt, value) => {
    this.setState({
      tabIndex: value
    })
  }

  /**
   * Handler to Update user entered contact details in state 
   */
  onPhoneNumberChange = (evt) => {
    this.setState({
      phoneNumber: evt.target.value
    })
  }

  /**
   * Handler to update user entered password in state
   */

  onPasswordChange = (evt) => {
    this.setState({
      password: evt.target.value
    })
  }

  /**
   *  Login Button Click Handler
   */
  loginClickHandler = async () => {

    let isValidPhone = true;
    if (this.state.phoneNumber === '') {
      isValidPhone = false;
      this.setState({ phoneNumberRequired: 'dispBlock' });
    } else if (!Utility.validatePhone(this.state.phoneNumber)) {
      isValidPhone = false;
      this.setState({ phoneNumberInvalid: 'dispBlock' });
    }

    let isValidPass = true;
    if (this.state.password === '') {
      isValidPass = false;
      this.setState({ passwordRequired: 'dispBlock' });
    }

    if (isValidPass && isValidPhone) {
      const encodedLoginData = 'Basic ' + btoa(this.state.phoneNumber + ':' + this.state.password);
      
      const self = this;
      let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(xhrLogin.status === 200) {
                  console.log(xhrLogin.getResponseHeader('access-token'));
                  sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
                  sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
                  sessionStorage.setItem('first_name', JSON.parse(this.responseText).first_name);
                  self.setState({
                    showSnackbar: true,
                    snackbarMessage: "Logged in successfully!",
                    modalIsOpen: false,
                    loggedIn: true,
                    loggedInUserFirstName: JSON.parse(this.responseText).first_name
                  })
                  self.loggedInUserData = JSON.parse(this.responseText);
                } else {
                  self.setState({
                    showLoginError: 'dispBlock',
                    loginErrorMessage: JSON.parse(this.responseText).message
                  })
                }
            }
        })

        xhrLogin.open("POST", "http://localhost:3080/api/customer/login");
        xhrLogin.setRequestHeader("Authorization", encodedLoginData);
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(null);

    }
  }


  /**
   * Firstname change handler
   */

  firstnameChangeHandler = (e) => {
    this.setState({ firstname: e.target.value });
  }

  /**
   * Lastname change Handler
   * @param {*} e 
   */
  lastnameChangeHandler = (e) => {
    this.setState({ lastname: e.target.value });
  }

  /**
   * Email Change Handler
   * @param {*} e 
   */

  emailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  }
  /**
   * Password Change Handler
   * @param {*} e 
   */


  registrationPasswordChangeHandler = (e) => {
    this.setState({ registrationPassword: e.target.value });
  }

  /**
   * Phone change Handler
   * @param {*} e 
   */

  registrationPhoneChangeHandler = (e) => {
    this.setState({ registrationPhone: e.target.value });
  }

  /**
   *  Registration Button click handler
   *  Validate Registration form data and make API call.
   */

  registerClickHandler = () => {
  
    // For firstname
    let isFirstNameValid = true;
    if (this.state.firstname === '') {
      isFirstNameValid = false;
      this.setState({
        firstnameRequired: 'dispBlock'
      })
    }

    // For Email
    let isEmailValid = true;
    if (this.state.email === '') {
      isEmailValid = false;
      this.setState({
        emailRequired: 'dispBlock'
      })
    } else if (!Utility.validateEmail(this.state.email)) {
      isEmailValid = false;
      this.setState({
        invalidEmail: 'dispBlock'
      })
    }

    // Password
    let isPasswordValid = true;
    if (this.state.registrationPassword === '') {
      isPasswordValid = false;
      this.setState({
        registrationPasswordRequired: 'dispBlock'
      })
    } else if (!Utility.validatePassword(this.state.registrationPassword)) {
      isPasswordValid = false;
      this.setState({
        registrationPasswordInvalid: 'dispBlock'
      })
    }

    //Phone
    let isPhoneValid = true;
    if (this.state.registrationPhone === '') {
      isPhoneValid = false;
      this.setState({
        registrationPhoneRequired: 'dispBlock'
      })
    } else if (!Utility.validatePhone(this.state.registrationPhone)) {
      isPhoneValid = false;
      this.setState({
        registrationPhoneInvalid: 'dispBlock'
      })
    }

    if (isFirstNameValid && isEmailValid && isPasswordValid && isPhoneValid) {
      let requestBody = {
        "contact_number": this.state.registrationPhone,
        "email_address": this.state.email,
        "first_name": this.state.firstname,
        "last_name": this.state.lastname,
        "password": this.state.registrationPassword
      }

      HTTPRequestHandler.doSignup(requestBody).then(res => {
        if (res && res.code && (res.code === 'SGR-001' || res.code === 'SGR-002'
          || res.code === 'SGR-003' || res.code === 'SGR-004' || res.code === 'SGR-005')) {
          this.setState({
            registrationFailed: 'dispBlock',
            registrationFailedMessage: res.message
          })
          return;
        } else if (res && res.id) {
          // registration success use case
          this.setState({
            showSnackbar: true,
            snackbarMessage: "Registered successfully! Please login now!",
            tabIndex: 0
          })
        }
      }).catch((error) => {
        this.setState({
          registrationFailed: 'dispBlock',
          registrationFailedMessage: error.message
        })
        return;
      });

    }
  }

  /**
   *  Explicit Snackbar close handler
   *  This handler will be called when user wants to close snackbar himself.
   */

  handleClose = () => {
    this.setState({
      showSnackbar: false
    })
  }
  /**
   *  Navigate to Home page
   */

  navigateToHome = () => {
    this.props.history.push('/')
  }



  render() {
    const { classes, screen } = this.props;
    return (<div className={ (screen === "Home")?classes.headerroot: classes.headerroot2}>
      <AppBar className={classes.appHeader}>
        <Toolbar className={classes.grow}>
          {(screen === "Details" || screen === "Home" || screen === "Profile" || screen === "Checkout") && <FastfoodIcon fontSize="large" style={{ color: 'whitesmoke' }} 
           onClick={this.navigateToHome}></FastfoodIcon>}
          {(screen === "Home") &&
            <TextField
              className={classes.search}
              id="input-with-icon-textfield"
              placeholder="Search by Restaurant Name"
              onChange={(e) => { this.props.searchHandler(e.target.value) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: '#fff' }} />
                  </InputAdornment>
                ),
                classes: {
                  input: classes.searchInput,
                }
              }}
            />}

          {(!this.state.loggedIn) &&
            <Button
              variant="contained"
              color="default"
              size="large"
              onClick={this.openModalHandler}
              className={classes.button}
              startIcon={<AccountCircle />}>
              <b> LOGIN </b>
            </Button>}
            
          {(this.state.loggedIn) &&
            <div>
              <Button onClick={this.onClickHandler} startIcon={<AccountCircle /> } style={{color:'white'}}>
                {this.state.loggedInUserFirstName}
              </Button>
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
                <div style={{ padding: '5px' }}>
                  {(screen !== "Profile") &&
                    <div>
                      <MenuItem onClick={this.onAccountClickHandler}>My Account</MenuItem>
                      <div className={classes.hr} />
                    </div>
                  }
                  <MenuItem onClick={this.onLogoutButtonClickHandler}>Logout</MenuItem>
                </div>
              </Popover>
            </div>
          }
        </Toolbar>
      </AppBar>
      <Modal ariaHideApp={false}
        isOpen={this.state.modalIsOpen}
        contentLabel="Login"
        onRequestClose={this.closeModalHandler}
        style={customStyles}>
        <Tabs value={this.state.tabIndex} onChange={this.tabChangeHandler} variant='fullWidth'>
          <Tab label={<b>LOGIN</b>}></Tab>
          <Tab label={<b>SIGNUP</b>}></Tab>
        </Tabs>
        {
          this.state.tabIndex === 0 &&
          <TabContainer>
            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="phoneNumber">Contact No.</InputLabel>
              <Input id="phoneNumber" type="text" phonenumber={this.state.phoneNumber} onChange={this.onPhoneNumberChange} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.phoneNumberRequired}>
                <span className="red">required</span>
              </FormHelperText>
              <FormHelperText className={this.state.phoneNumberInvalid}>
                <span className="red">Invalid Contact</span>
              </FormHelperText>

            </FormControl>
            <br /> <br />
            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input id="password" type="password" password={this.state.password} onChange={this.onPasswordChange} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.passwordRequired}>
                <span className="red">required</span>
              </FormHelperText>
              <FormHelperText className={this.state.passwordInvalid}>
                <span className="red">Invalid Credentials</span>
              </FormHelperText>

              <FormHelperText className={this.state.showLoginError}>
                <span className="red">{this.state.loginErrorMessage}</span>
              </FormHelperText>

            </FormControl>
            <br /><br />
            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
          </TabContainer>
        }

        {
          this.state.tabIndex === 1 &&
          <TabContainer>
            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.firstnameChangeHandler} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.firstnameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br /> <br />

            <FormControl fullWidth={true}>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.lastnameChangeHandler} fullWidth={true} autoComplete='false' />
            </FormControl>

            <br /> <br />

            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input id="email" type="email" email={this.state.email} onChange={this.emailChangeHandler} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.emailRequired}>
                <span className="red">required</span>
              </FormHelperText>
              <FormHelperText className={this.state.invalidEmail}>
                <span className="red">Invalid Email</span>
              </FormHelperText>
            </FormControl>
            <br /> <br />

            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="registrationpassword">Password</InputLabel>
              <Input id="registrationpassword" type="password" registrationpassword={this.state.registrationPassword} onChange={this.registrationPasswordChangeHandler} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.registrationPasswordRequired}>
                <span className="red">required</span>
              </FormHelperText>

              <FormHelperText className={this.state.registrationPasswordInvalid}>
                <span className="red">Password must contain at least one capital letter, </span> <br />
                <span className="red">one small letter, one number, and one special character</span>
              </FormHelperText>

            </FormControl>
            <br /> <br />
            <FormControl required fullWidth={true}>
              <InputLabel htmlFor="registrationphone">Contact No.</InputLabel>
              <Input id="registrationphone" type="text" registrationpassword={this.state.registrationphone} onChange={this.registrationPhoneChangeHandler} fullWidth={true} autoComplete='false' />
              <FormHelperText className={this.state.registrationPhoneRequired}>
                <span className="red">required</span>
              </FormHelperText>
              <FormHelperText className={this.state.registrationPhoneInvalid}>
                <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
              </FormHelperText>

              <FormHelperText className={this.state.registrationFailed}>
                <br />
                <span className="red">{this.state.registrationFailedMessage}</span>
              </FormHelperText>
            </FormControl>

            <br /><br />
            <Button variant="contained" color="primary" onClick={this.registerClickHandler}>REGISTER</Button>
          </TabContainer>
        }

      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={this.state.showSnackbar}
        onClose={this.handleClose}
        message={this.state.snackbarMessage}
        key='bottom-left'
        autoHideDuration={4000}
      />
    </div>)
  }
}

export default withStyles(headerStyles)(Header)
import { Component, Fragment } from 'react';
import './Checkout.css';
import { Redirect } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Header from "../../common/header/Header";
import CheckoutItems from '../../common/checkoutItems/CheckoutItems'
import Utility from '../../common/Utility';


class Checkout extends Component {

    accessToken = null;
    constructor(props) {
        super(props);
        const orderItems = props.location.state.orderItems;
        const total = props.location.state.total;
        const restaurantName = props.location.state.restaurantName;
        /*
         orderItems: this.state.orderItems,
                    total: this.state.totalAmount, restaurantName: this.restaurantDetails.restaurant_name
        */
        this.state = {
            name: restaurantName,
            totalAmt: total,
            orderItems: orderItems,
            activeStep: 0,
            activeTabValue: 'existing_address',
            isFlatRequired: 'dispNone',
            isLocalityRequired: 'dispNone',
            isCityRequired: 'dispNone',
            isStateUUIDRequired: 'dispNone',
            isPincodeRequired: 'dispNone',
            pincodeValid: 'dispNone',
            selectedAddressId: undefined,
            displayChange: 'dispNone',
            placeOrderHandlerMessage: undefined,
            placeOrderHandlerMessageOpen: false,
            couponId: undefined,
            addresses: [],
            states: [],
            payments: [],
            flat: '',
            locality: '',
            city: '',
            stateUUID: '',
            pincode: '',
            paymentId: '',
            restaurantId: props.location.state.restaurantId

        };
    }

    componentDidMount() {
        if (this.props.location.state !== undefined && sessionStorage.getItem('access-token') !== null) {
            this.accessToken = sessionStorage.getItem('access-token');
            this.retreiveAll();
        }
    }


    retreiveAll() {
        this.getAddress();
        this.getStates();
        this.getPayments();
    }

    /**
     *  Make an API call to get address for logged in customer
     * 
     */

    getAddress = () => {
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                self.setState({ addresses: JSON.parse(this.responseText).addresses });
            }
        });
        let url = this.props.baseUrl + 'address/customer';
        xhr.open('GET', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + this.accessToken);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    /**
     *  Retrieve list of states
     *  this is no auth API call
     * 
     */
    getStates = () => {
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                self.setState({ states: JSON.parse(this.responseText).states });
            }
        });
        let url = this.props.baseUrl + 'states/';
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    /**
     *  Get Payment Methods for customer
     * 
     */

    getPayments = () => {
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ payments: JSON.parse(this.responseText).paymentMethods });
            }
        });
        let url = this.props.baseUrl + 'payment';
        xhr.open('GET', url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }



    incrementStepHandler = () => {
        if (this.state.activeStep === 0 && this.state.selectedAddressId === undefined) {
        } else if (this.state.activeStep === 1 && this.state.paymentId === '') {
        } else {
            let activeState = this.state.activeStep + 1;
            let changeAddressPayment = 'dispNone';
            if (activeState === 2) {
                changeAddressPayment = 'dispBlock';
            }
            this.setState({ activeStep: activeState, displayChange: changeAddressPayment })
        }
    }

    decrementStepHandler = () => {
        let activeState = this.state.activeStep - 1;
        this.setState({ activeStep: activeState })
    }

    resetStepHandler = () => {
        this.setState({ activeStep: 0, displayChange: 'dispNone' })
    }
    onTabChange = (value) => {
        this.setState({ activeTabValue: value })
        if (value === 'existing_address') {
            this.getAddress();
        }
    }

    selectAddressHandler = (e) => {
        let elementId = e.target.id;
        if (elementId.startsWith('select-address-icon-')) {
            this.setState({ selectedAddressId: elementId.split('select-address-icon-')[1] });
        }
        if (elementId.startsWith('select-address-button-')) {
            this.setState({ selectedAddressId: elementId.split('select-address-button-')[1] })
        }
    }

    onInputFieldChangeHandler = (e) => {
        let stateKey = e.target.id;
        let stateValue = e.target.value;
        if (stateKey === undefined) {
            stateKey = 'stateUUID';
        }
        let stateValueRequiredKey = stateKey + 'Required';
        let stateKeyRequiredValue = false;
        if (stateValue === '') {
            stateKeyRequiredValue = true;
        }
        let validPincode = false;
        if (stateKey === 'pincode') {
            validPincode = Utility.validatePincode(stateValue);
        }
        this.setState({
            [stateKey]: stateValue,
            [stateValueRequiredKey]: stateKeyRequiredValue,
            pincodeValid: validPincode ? 'dispNone' : 'dispBlock'
        });
    }

    onPaymentSelectionHandler = (e) => {
        this.setState({ 'paymentId': e.target.value });
    }

    placeOrderHandlerMessageCloseHandler = () => {
        this.setState({ placeOrderHandlerMessageOpen: false });
    }

    saveAddressHandler = () => {
        let isValid = true;
        if (this.state.city === '') {
            this.setState({
                isCityRequired: 'dispBlock'
            })
            isValid = false;
        }
        if (this.state.locality === '') {
            this.setState({
                isLocalityRequired: 'dispBlock'
            })
            isValid = false;
        }
        if (this.state.flat === '') {
            this.setState({
                isFlatRequired: 'dispBlock'
            })
            isValid = false;
        }
        if (this.state.stateUUID === '') {
            this.setState({
                isStateUUIDRequired: 'dispBlock'
            })
            isValid = false;
        }
        if (this.state.pincode === '') {
            this.setState({
                isPincodeRequired: 'dispBlock'
            })
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        let address = {
            city: this.state.city,
            flat_building_name: this.state.flat,
            locality: this.state.locality,
            pincode: this.state.pincode,
            state_uuid: this.state.stateUUID
        }

        let token = this.accessToken
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    addresses: JSON.parse(this.responseText).addresses,
                    city: '',
                    locality: '',
                    flat: '',
                    stateUUID: '',
                    pincode: ''
                });
            }
        });

        let url = this.props.baseUrl + 'address/';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(address));
    }

    placeOrderHandler = () => {
        debugger;
        if (this.state.selectedAddressId === '' || this.state.selectedAddressId === undefined || this.state.paymentId === '' || this.state.paymentId === undefined || this.state.displayChange === 'dispNone') {
            this.setState({
                placeOrderHandlerMessage: 'Unable to place your order! Please try again!',
                placeOrderHandlerMessageOpen: true
            })
            return;
        }
        let bill = this.props.location.state.total;
        let itemQuantities = [];
        this.props.location.state.orderItems.items.map((item, index) => (
            itemQuantities.push({ item_id: item.id, price: item.quantity * item.pricePerItem, quantity: item.quantity })
        ))
        let order = {
            address_id: this.state.selectedAddressId,
            coupon_id: this.state.couponId,
            item_quantities: itemQuantities,
            payment_id: this.state.paymentId,
            restaurant_id: this.state.restaurantId,
            bill: bill,
            discount: 0
        }
        let token = sessionStorage.getItem('access-token');
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    let orderId = JSON.parse(this.responseText).id;
                    that.setState({
                        placeOrderHandlerMessage: 'Order placed successfully! Your order ID is ' + orderId,
                        placeOrderHandlerMessageOpen: true
                    });
                } else {
                    that.setState({
                        placeOrderHandlerMessage: 'Unable to place your order! Please try again!',
                        placeOrderHandlerMessageOpen: true
                    });
                    console.clear();
                }
            }
        }
        );

        let url = this.props.baseUrl + 'order';
        xhr.open('POST', url);
        xhr.setRequestHeader('authorization', 'Bearer ' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(order));
    }

    render() {

        if (this.props.location.state === undefined || sessionStorage.getItem('access-token') === null) {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Header screen={"Checkout"}
                    {...this.props} ></Header>
                <div className='checkout-container'>
                    <div className='delivery-payment-section'>
                        <Stepper activeStep={this.state.activeStep} orientation='vertical'>
                            <Step key='Delivery'>
                                <StepLabel>Delivery</StepLabel>
                                <StepContent>
                                    <div>
                                        <AppBar position={"relative"}>
                                            <Tabs value={this.state.activeTabValue} variant='standard'>
                                                <Tab value='existing_address' label='EXISTING ADDRESS'
                                                    onClick={() => this.onTabChange('existing_address')} />
                                                <Tab value='new_address' label='NEW ADDRESS'
                                                    onClick={() => this.onTabChange('new_address')} />
                                            </Tabs>
                                        </AppBar>
                                    </div>
                                    <div id='existing-address-display'
                                        className={this.state.activeTabValue === 'existing_address' ? 'dispBlock' : 'dispNone'}>
                                        {this.state.addresses === undefined || this.state.addresses.length === 0 ?
                                            <Typography style={{ margin: 10, marginBottom: 200 }} color='textSecondary'
                                                component='p'>
                                                There are no saved addresses! You can save an address using the 'New
                                                Address' tab or using your ‘Profile’ menu option.
                                            </Typography> :
                                            <GridList style={{ flexWrap: 'nowrap' }} cols={3} cellHeight='auto'>
                                                {
                                                    (this.state.addresses || []).map((address, index) => (
                                                        <GridListTile key={address.id}
                                                            className={this.state.selectedAddressId === address.id ? 'grid-list-tile-selected-address' : null}>
                                                            <div className='address-box'>
                                                                <p>{address.flat_building_name}</p>
                                                                <p>{address.locality}</p>
                                                                <p>{address.city}</p>
                                                                <p>{address.state.state_name}</p>
                                                                <p>{address.pincode}</p>
                                                            </div>
                                                            <Grid container>
                                                                <Grid item xs={6} lg={10}></Grid>
                                                                <Grid item xs={2}>
                                                                    <IconButton
                                                                        id={'select-address-button-' + address.id}
                                                                        className='select-address-icon'
                                                                        onClick={this.selectAddressHandler}>
                                                                        <CheckCircleIcon
                                                                            id={'select-address-icon-' + address.id}
                                                                            className={this.state.selectedAddressId === address.id ? 'display-green-icon' : 'display-grey-icon'} />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </GridListTile>
                                                    ))
                                                }
                                            </GridList>
                                        }
                                    </div>
                                    <div id='new-address-display'
                                        className={this.state.activeTabValue === 'new_address' ? 'dispBlock' : 'dispNone'}>
                                        <FormControl style={{ minWidth: 300 }}>
                                            <InputLabel htmlFor='flat'>Flat/Building No</InputLabel>
                                            <Input id='flat' name='flat' type='text' value={this.state.flat}
                                                flat={this.state.flat}
                                                onChange={this.onInputFieldChangeHandler} />
                                            <FormHelperText className={this.state.isFlatRequired}>
                                                <span style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <FormControl style={{ minWidth: 300 }}>
                                            <InputLabel htmlFor='locality'>Locality</InputLabel>
                                            <Input id='locality' name='locality' type='text' value={this.state.locality}
                                                locality={this.state.locality}
                                                onChange={this.onInputFieldChangeHandler} />
                                            <FormHelperText className={this.state.isLocalityRequired}>
                                                <span style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <FormControl style={{ minWidth: 300 }}>
                                            <InputLabel htmlFor='city'>City</InputLabel>
                                            <Input id='city' name='city' type='text' value={this.state.city}
                                                city={this.state.city}
                                                onChange={this.onInputFieldChangeHandler} />
                                            <FormHelperText className={this.state.isCityRequired}>
                                                <span style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <FormControl style={{ minWidth: 300 }}>
                                            <InputLabel htmlFor='stateUUID'>State</InputLabel>
                                            <Select id='stateUUID' name='stateUUID' value={this.state.stateUUID}
                                                onChange={this.onInputFieldChangeHandler}>
                                                {this.state.states.map((state, index) => (
                                                    <MenuItem key={state.id} value={state.id}>{state.state_name}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText className={this.state.isStateUUIDRequired}>
                                                <span style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <FormControl style={{ minWidth: 300 }}>
                                            <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                            <Input id='pincode' name='pincode' type='text' value={this.state.pincode}
                                                pincode={this.state.pincode}
                                                onChange={this.onInputFieldChangeHandler} />
                                            <FormHelperText className={this.state.isPincodeRequired}>
                                                <span style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                            <FormHelperText className={this.state.pincodeValid}>
                                                <span style={{ color: "red" }}>Pincode must contain only numbers and must be 6 digits long</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <FormControl style={{ minWidth: 150 }}>
                                            <Button variant='contained' color='secondary' onClick={this.saveAddressHandler}>SAVE
                                                ADDRESS</Button>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <Button style={{ margin: 5 }} disabled={this.state.activeStep === 0}>Back</Button>
                                        <Button style={{ margin: 5 }} className='button' variant="contained" color="primary"
                                            onClick={this.incrementStepHandler}>Next</Button>
                                    </div>
                                </StepContent>
                            </Step>
                            <Step key='Payment'>
                                <StepLabel>Payment</StepLabel>
                                <StepContent>
                                    <div id='payment-modes'>
                                        <FormControl>
                                            <FormLabel>Select Mode of Payment</FormLabel>
                                            <RadioGroup onChange={this.onPaymentSelectionHandler} value={this.state.paymentId}>
                                                {(this.state.payments || []).map((payment, index) => (
                                                    <FormControlLabel key={payment.id} value={payment.id} control={<Radio />}
                                                        label={payment.payment_name} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <Button style={{ margin: 5 }} onClick={this.decrementStepHandler}>Back</Button>
                                    <Button style={{ margin: 5 }} variant="contained" color="primary"
                                        onClick={this.incrementStepHandler}>Finish</Button>
                                </StepContent>
                            </Step>
                        </Stepper>
                        <div className={this.state.displayChange}>
                            <Typography style={{ marginLeft: 40 }} variant='h5'>
                                View the summary and place your order now!
                            </Typography>
                            <Button style={{ marginLeft: 40, marginTop: 20 }} onClick={this.resetStepHandler}>CHANGE</Button>
                        </div>
                    </div>
                    <div className='summary-section'>
                        <Card variant='elevation' className='summary-card'>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Summary
                                </Typography>
                                <br />
                                <Typography variant='h6' component='h3' color='textSecondary'
                                    style={{ textTransform: "capitalize", marginBottom: 15 }}>
                                    {this.props.location.state.restaurantName}
                                </Typography>
                                <CheckoutItems divider='true' orderitems={this.props.location.state.orderItems}
                                    total={this.props.location.state.total} placeOrderHandler={this.placeOrderHandler} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div>
                    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} key='01'
                        message={this.state.placeOrderHandlerMessage}
                        open={this.state.placeOrderHandlerMessageOpen}
                        onClose={this.placeOrderHandlerMessageCloseHandler}
                        autoHideDuration={3000}
                        action={<Fragment> <IconButton color='inherit'
                            onClick={this.placeOrderHandlerMessageCloseHandler}><CloseIcon /></IconButton></Fragment>} />
                </div>

            </div>
        )
    }
}

export default Checkout;
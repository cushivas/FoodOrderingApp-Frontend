import { Component, Fragment } from 'react';
import './Details.css'
import Header from '../../common/header/Header';
import HTTPRequestHandler from '../../common/Http-handler';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';
import Snackbar from '@material-ui/core/Snackbar';


const detailsStyles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'lightgrey',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        }
    },
    images: {
        height: 175,
    },
    imageContainer: {
        width: '25%',
        padding: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            width: "90% !important",
            padding: theme.spacing(2),
          }
    },
    container: {
        width: '75%',
        padding: theme.spacing(0.5),
        [theme.breakpoints.down('xs')]: {
            width: '90%',
            margin: theme.spacing(1),
        }
    },
    innerFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItemsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            margin: theme.spacing(1),
        }
    },
    leftItemContainer: {
        width: '40%',
        margin: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            width: "90% !important",
            margin: theme.spacing(2),
          }
    },

    rightItemContainer: {
        width: '40%',
        margin: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            width: "95% !important",
          }
    },
    leftmenu: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    }
})

class Details extends Component {

    restaurantDetails;

    constructor(props) {
        super(props);
        const routeData = props.location.state.id;
        const categoryData = props.location.state.categories;
        this.state = {
            id: routeData,
            details: {},
            categories: categoryData,
            orderItems: { id: null, items: [], total: 0 },
            totalAmount: 0.00,
            cartItems: [],
            open: false,
            totalItems: 0,
            nonloggedIn:false,
            itemQuantityDecreased:false,
            itemQuantityIncreased:false,
            cartEmpty:false,
            itemRemovedFromCart:false

        }; // Read values passed on state
    }



    async componentDidMount() {
        const restaurantData = await HTTPRequestHandler.getRestaurantDetails(this.state.id);
        this.restaurantDetails = restaurantData;
        this.setState({
            details: restaurantData
        })
    }


    capitalize = (str) => {
        var arr = str.split(" ")
        var pascalCasedString = ""
        arr.map(a => (
            pascalCasedString += a.charAt(0).toUpperCase() + a.slice(1) + " "
        )
        )
        return pascalCasedString
    }


    getIndex = (value, arr, prop) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return i;
            }
        }
        return -1;
    }


    addItemToCartHandler = (event, id, type, name, price) => {
        let totalAmount = this.state.totalAmount + price;
        let totalItems = this.state.totalItems + 1;

        if (this.state.orderItems.items !== undefined && this.state.orderItems.items.some(item => (item.name === name))) {
            const index = this.getIndex(name, this.state.orderItems.items, "name");
            let currentOrderState = this.state.orderItems;
            currentOrderState.items[index].quantity = currentOrderState.items[index].quantity + 1;
            currentOrderState.items[index].priceForAll = currentOrderState.items[index].priceForAll + currentOrderState.items[index].pricePerItem;
            this.setState({
                orderItems: currentOrderState
            })
            /*       let item = this.state.orderItems.items[index];
                  item.quantity = quantity;
                  item.priceForAll = priceForAll;
                  this.setState(item); */

        } else {
            // lets create new Item object
            const newlyAddedItem = {};
            newlyAddedItem.id = id;
            newlyAddedItem.type = type;
            newlyAddedItem.name = name;
            newlyAddedItem.pricePerItem = price;
            newlyAddedItem.quantity = 1;
            newlyAddedItem.priceForAll = price;

            // Current CartItems State
            let cartItemsArr = this.state.cartItems;
            cartItemsArr.push(newlyAddedItem);
            const orderItems = this.state.orderItems;
            orderItems.items = this.state.cartItems;
            this.setState({ orderItems: orderItems });
        }

        this.setState({ open: true });
        this.setState({ totalItems: totalItems });
        this.setState({ totalAmount: totalAmount });
    }


    removeFromCartHandler = (event, id, type, name, price) => {
        let currentOrderItems = this.state.orderItems;
        const index = this.getIndex(name, currentOrderItems.items, "name");

        if (currentOrderItems.items[index].quantity > 1) {
            currentOrderItems.items[index].quantity = currentOrderItems.items[index].quantity - 1;
            currentOrderItems.items[index].priceForAll = currentOrderItems.items[index].priceForAll - currentOrderItems.items[index].pricePerItem;
        } else {
            currentOrderItems.items.splice(index, 1);
        }
        this.setState({itemQuantityDecreased: true,
            orderItems: currentOrderItems
        });
        const totalAmt = this.state.totalAmount - price;
        const totalItms = this.state.totalItems -1;
        this.setState({totalItems: totalItms, totalAmount: totalAmt});
    }

    /**
     * 
     * @param {*} item 
     * @param {*} index 
     */

    addItemDirectlyFromUserCart = (item, index) => {
        let currentOrderItems = this.state.orderItems;
        const itemIndex = this.getIndex(item.name, currentOrderItems.items, "name");


        currentOrderItems.items[itemIndex].quantity = currentOrderItems.items[itemIndex].quantity + 1;
        currentOrderItems.items[itemIndex].priceForAll = currentOrderItems.items[itemIndex].priceForAll + currentOrderItems.items[itemIndex].pricePerItem;
        this.setState({ itemQuantityIncreased: true });
        let totalAmount = this.state.totalAmount;
        totalAmount += item.pricePerItem;
        let totalItems = this.state.totalItems;
        totalItems += 1;
        this.setState({
            orderItems: currentOrderItems
        });

        this.setState({ totalItems: totalItems });
        this.setState({ totalAmount: totalAmount });
    }

    /**
     * 
     * Event handler for checkout button click
     * Show error if no items in cart.
     * 
     */

    checkoutHandler = () => {
        if (this.state.totalItems === 0) {
            this.setState({cartEmpty: true});
        } else if (this.state.totalItems > 0 && sessionStorage.getItem('access-token') === null) {
            this.setState({nonloggedIn: true});
        } else {
            this.props.history.push({
                pathname: '/checkout/',
                state: {
                    orderItems: this.state.orderItems,
                    total: this.state.totalAmount, restaurantName: this.restaurantDetails.restaurant_name
                }
            })
        }
    }

    /**
     *  Reset all the snackbar messages
     */

    handleClose = () => {
        this.setState({
            open: false,
            nonloggedIn:false,
            itemQuantityDecreased:false,
            itemQuantityIncreased:false,
            cartEmpty:false,
            itemRemovedFromCart:false
        })
    }






    render() {

        const { classes } = this.props;
        return (
            <div>
                <div>
                    <Header
                        screen={"Details"}
                        {...this.props}
                    ></Header>
                    {this.restaurantDetails && <Card className={classes.root}>
                        <div className={classes.imageContainer}>
                            <CardMedia className={classes.images}
                                image={this.restaurantDetails.photo_URL}
                                title={this.restaurantDetails.restaurant_name}>
                            </CardMedia>
                        </div>

                        <div className={classes.container}>
                            <CardContent className={classes.content}>
                                <Typography component="h5" variant="h5">
                                    {this.restaurantDetails.restaurant_name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {this.restaurantDetails.address.locality.toUpperCase()}
                                </Typography> <br />
                                <Typography variant="subtitle2" >
                                    {this.state.categories}
                                </Typography> <br />
                                <div className={classes.innerFlex}>
                                    <div>
                                        <i className="fa fa-star" aria-hidden="true">
                                            <span> {this.restaurantDetails.customer_rating} </span>
                                        </i>
                                        <Typography variant="caption" display="block" color="textSecondary">
                                            AVERAGE RATING BY
                                        </Typography>
                                        <Typography variant="caption" display="block" color="textSecondary">
                                            <b>{this.restaurantDetails.number_customers_rated}</b> CUSTOMERS
                                        </Typography>
                                    </div>

                                    <div>
                                        <i className="fa fa-inr" aria-hidden="true">
                                            <span>{this.restaurantDetails.average_price} </span>
                                        </i>
                                        <Typography variant="caption" display="block" color="textSecondary">
                                            AVERAGE COST FOR
                                        </Typography>
                                        <Typography variant="caption" display="block" color="textSecondary">
                                            TWO PEOPLE
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </div>

                    </Card>}
                </div>

                {this.restaurantDetails && <div className={classes.menuItemsContainer}>
                    <div className={classes.leftItemContainer}>
                        {this.restaurantDetails.categories.map((category) => (
                            <Fragment>
                                <Typography variant="caption" display="block" color="textSecondary" key={category.category_name}>
                                    <b> {category.category_name.toUpperCase()} </b>
                                </Typography>
                                <Divider />
                                {category.item_list.map((item, itemIndex) => (
                                    <Grid container key={item.id} style={{ marginBottom: 10, marginTop: 10 }}>
                                        <Grid item xs={1} lg={1} key={item.id + itemIndex + 'icon'}>
                                            {
                                                item.item_type === "VEG" ?
                                                    <span className="fa fa-circle" aria-hidden="true"
                                                        style={{ fontSize: "12px", color: "#2a8000" }} />
                                                    :
                                                    <span className="fa fa-circle" aria-hidden="true"
                                                        style={{ fontSize: "12px", color: "#FF0000" }} />
                                            }
                                        </Grid>
                                        <Grid item xs={6} lg={6}>
                                            <Typography>
                                                <span
                                                    className="item-name">  {this.capitalize(item.item_name)} </span>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} lg={3}>
                                            <div style={{float:'right'}}>
                                                <span>
                                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                                    <span
                                                        style={{ paddingLeft: "2px" }}>{item.price.toFixed(2)}</span>
                                                </span>
                                            </div>
                                        </Grid>

                                        <Grid item xs={2} lg={2}>
                                            <IconButton style={{ padding: '5px', float: 'right' }}
                                                onClick={(e) => this.addItemToCartHandler(e, item.id, item.item_type, item.item_name, item.price)}>
                                                <AddIcon style={{ padding: 0, fontSize: "24px" }} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Fragment>
                        ))}

                    </div>

                    <div className={classes.rightItemContainer}>
                        <Card>
                            <CardContent>
                                <div style={{ fontWeight: "bold" }}>
                                    <i style={{ paddingRight: "20px" }}>
                                        <Badge className="badge" badgeContent={this.state.totalItems}
                                            color="primary" showZero>
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </i>My Cart
                                </div>
                                <div className="cart-item-list">
                                    <Grid container>
                                        {
                                            this.state.orderItems.items !== undefined ?
                                                this.state.orderItems.items.map((item, index) => (
                                                    <Fragment key={item.id}>
                                                        <Grid item xs={2} lg={2}>
                                                            {item.type === "VEG" ?
                                                                <span className="fa fa-stop-circle-o"
                                                                    aria-hidden="true"
                                                                    style={{
                                                                        fontSize: "12px",
                                                                        color: "#2a8000",
                                                                        paddingRight: "12px"
                                                                    }} /> :
                                                                <span className="fa fa-stop-circle-o"
                                                                    aria-hidden="true"
                                                                    style={{
                                                                        fontSize: "12px",
                                                                        color: "#ff0000",
                                                                        paddingRight: "12px"
                                                                    }} />}
                                                        </Grid>
                                                        <Grid item xs={3} lg={4}>
                                                            <Typography variant="subtitle1" color="textSecondary">
                                                                {this.capitalize(item.name)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} lg={3} style={{ flexWrap: "wrap" }}>
                                                            <div className='add-remove-icon'>
                                                                <IconButton className='add-remove-button-hover'
                                                                    style={{ display: "flex", padding: '5px'}}
                                                                     onClick={(e) => this.removeFromCartHandler(e, item.id, item.type, item.name, item.pricePerItem)} ><RemoveIcon
                                                                        fontSize='default'
                                                                        style={{ color: 'black', fontWeight: "bolder" }} /></IconButton>
                                                                <Typography variant="subtitle1"
                                                                    style={{ fontWeight: 'bold' }}>{item.quantity}</Typography>
                                                                <IconButton className='add-remove-button-hover'
                                                                    style={{ display: "flex", padding: '5px'}}
                                                                    onClick={this.addItemDirectlyFromUserCart.bind(this, item, index)}>
                                                                    <AddIcon fontSize='default' style={{
                                                                        color: 'black',
                                                                        fontWeight: "bolder"
                                                                    }} /></IconButton>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={4} lg={3}>
                                                            <span style={{ float: 'right' }}>
                                                                <i className="fa fa-inr" aria-hidden="true"></i>
                                                                <span
                                                                    style={{ paddingLeft: "2px" }}>{item.priceForAll.toFixed(2)}</span>
                                                            </span>
                                                        </Grid>
                                                        <Divider />
                                                    </Fragment>
                                                )) : null}
                                        <Grid item xs={8} lg={9}>
                                            <div style={{ marginTop: 15, marginBottom: 15 }}>
                                                <span style={{ fontWeight: 'bold' }}>TOTAL AMOUNT</span>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4} lg={3}>
                                            <div style={{ marginTop: 15, marginBottom: 15 }}>
                                                <span style={{ fontWeight: 'bold', float: 'right' }}>
                                                    <i className="fa fa-inr" aria-hidden="true"
                                                        style={{ paddingRight: "2px" }}></i>{this.state.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button className="checkout" variant="contained" color="primary" onClick={this.checkoutHandler}>
                                                <Typography>CHECKOUT</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.open}
                        onClose={this.handleClose}
                        message="Item added to cart!"
                        key='Item added to cart!'
                        autoHideDuration={3000}
                    />

                        <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.cartEmpty}
                        onClose={this.handleClose}
                        message="Please add an item to your cart!"
                        key='Please add an item to your cart!'
                        autoHideDuration={3000}
                        />

                        <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.itemQuantityDecreased}
                        onClose={this.handleClose}
                        message="Item quantity decreased by 1!"
                        key='Item quantity decreased by 1!'
                        autoHideDuration={3000}
                        />

                        <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.nonloggedIn}
                        onClose={this.handleClose}
                        message="Please login first!"
                        key='Please login first!'
                        autoHideDuration={3000}
                        />


                        <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.itemRemovedFromCart}
                        onClose={this.handleClose}
                        message="Item removed from cart!"
                        key='Item removed from cart!'
                        autoHideDuration={3000}
                        />

                        <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={this.state.itemQuantityIncreased}
                        onClose={this.handleClose}
                        message="Item quantity increased by 1!"
                        key='Item quantity increased by 1!'
                        autoHideDuration={3000}
                        />


                </div>}
            </div>

        )
    }
}

export default withStyles(detailsStyles)(Details);


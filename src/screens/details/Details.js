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


const detailsStyles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'lightgrey'
    },
    images: {
        height: 175,
    },
    imageContainer: {
        width: '25%',
        padding: theme.spacing(2),
    },
    container: {
        width: '75%',
        padding: theme.spacing(0.5),
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
    },
    leftItemContainer: {
        width: '40%',
        margin: theme.spacing(1),
    },

    rightItemContainer: {
        width: '40%',
        margin: theme.spacing(1),
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
            orderItems: {id: null, items: [], total: 0},
            totalAmount:0.00,
        }; // Read values passed on state
    }



    async componentDidMount() {
        const restaurantData = await HTTPRequestHandler.getRestaurantDetails(this.state.id);
        this.restaurantDetails = restaurantData;
        this.setState({
            details: restaurantData
        })
    }


    Capitalize(str) {
        var arr = str.split(" ")
        var pascalCasedString = ""
        arr.map(a => (
            pascalCasedString += a.charAt(0).toUpperCase() + a.slice(1) + " "
        )
        )
        return pascalCasedString
    }

    render() {

        const { classes } = this.props;
        return (
            <div>
                <div>
                    <Header
                        screen={"Details"}
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
                                                    className="item-name">  {this.Capitalize(item.item_name)} </span>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} lg={3}>
                                            <div className='pricePerItem'>
                                                <span>
                                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                                    <span
                                                        style={{ paddingLeft: "2px" }}>{item.price.toFixed(2)}</span>
                                                </span>
                                            </div>
                                        </Grid>

                                        <Grid item xs={2} lg={2}>
                                            <IconButton style={{ padding: 0, float: 'left' }}
                                                onClick={(e) => this.addToCartHandler(e, item.id, item.item_type, item.item_name, item.price)}>
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
                                                                        color: "green",
                                                                        paddingRight: "12px"
                                                                    }} /> :
                                                                <span className="fa fa-stop-circle-o"
                                                                    aria-hidden="true"
                                                                    style={{
                                                                        fontSize: "12px",
                                                                        color: "red",
                                                                        paddingRight: "12px"
                                                                    }} />}
                                                        </Grid>
                                                        <Grid item xs={3} lg={4}>
                                                            <Typography>
                                                                {this.Capitalize(item.name)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3} lg={3} style={{ flexWrap: "wrap" }}>
                                                            <div className='add-remove-icon'>
                                                                <IconButton className='add-remove-button-hover'
                                                                    style={{ display: "flex", padding: 0 }}
                                                                    onClick={(e) => this.removeFromCartHandler(e, item.id, item.type, item.name, item.pricePerItem)}><RemoveIcon
                                                                        fontSize='default'
                                                                        style={{ color: 'black', fontWeight: "bolder" }} /></IconButton>
                                                                <Typography
                                                                    style={{ fontWeight: 'bold' }}>{item.quantity}</Typography>
                                                                <IconButton className='add-remove-button-hover'
                                                                    style={{ display: "flex", padding: 0 }}
                                                                    onClick={this.addAnItemFromCartHandler.bind(this, item, index)}>
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

                    {/* <CustomizedSnackbar open={this.state.open} closeHandler={this.closeHandler}
                        message="Item added to cart!" />
                    <CustomizedSnackbar open={this.state.cartEmpty} closeHandler={this.closeHandler}
                        message="Please add an item to your cart!" />
                    <CustomizedSnackbar open={this.state.itemQuantityDecreased} closeHandler={this.closeHandler}
                        message="Item quantity decreased by 1!" />
                    <CustomizedSnackbar open={this.state.nonloggedIn} closeHandler={this.closeHandler}
                        message="Please login first!" />
                    <CustomizedSnackbar open={this.state.itemRemovedFromCart} closeHandler={this.closeHandler}
                        message="Item removed from cart!" />
                    <CustomizedSnackbar open={this.state.itemQuantityIncreased} closeHandler={this.closeHandler}
                        message="Item quantity increased by 1!" /> */}

                </div>}
            </div>

        )
    }
}

export default withStyles(detailsStyles)(Details);


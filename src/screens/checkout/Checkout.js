import { Component } from 'react';
import './Checkout.css';


class Checkout extends Component {
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
        }; // Read values passed on state
    }

    render(){
        return(
            <div>
                Inside Checkout
            </div>
        )
    }
}

export default Checkout;
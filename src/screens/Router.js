import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./home/Home";
import Details from './details/Details';
import Checkout from './checkout/Checkout';
import Profile from './profile/Profile';


class Router extends Component {
    baseUrl= '';
    constructor() {
        super();
        this.baseUrl = 'http://localhost:3080/api/';
    }

    render(){
        return(
            <BrowserRouter>
                <div className="main-container">
                <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl} />} />
                <Route exact path='/restaurant/:id' render={(props) => <Details {...props} baseUrl={this.baseUrl} />} />
                <Route exact path='/checkout' render={(props) => <Checkout {...props} baseUrl={this.baseUrl} />} />
                <Route exact path='/profile' render={(props) => <Profile {...props} baseUrl={this.baseUrl} />} />
                </div>
            </BrowserRouter>
        )
    }
}

export default Router;
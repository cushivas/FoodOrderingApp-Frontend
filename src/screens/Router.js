import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./home/Home";

class Router extends Component {
    baseUrl= '';
    constructor() {
        super();
        this.baseUrl = '';
    }

    render(){
        return(
            <BrowserRouter>
                <div className="main-container">
                <Route exact path='/' render={(props) => <Home {...props} accessToken={this.baseUrl} />} />
                </div>
            </BrowserRouter>
        )
    }
}

export default Router;
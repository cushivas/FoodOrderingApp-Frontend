import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./home/home";

class Router extends Component {
    constructor() {
        super();
    }

    render(){
        return(
            <BrowserRouter>
                <div className="main-container">
                    <Route exact path="/" render={(props)=><Home {...props}/>}> </Route>
                </div>
            </BrowserRouter>
        )
    }
}

export default Router;
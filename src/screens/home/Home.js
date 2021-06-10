import { Component } from 'react';
import Header from '../../common/header/Header';
import './Home.css';


class Home extends Component {
    constructor() {
        super();
    }

    render() {
        return(
            <Header 
            screen={"Home"}
            ></Header>
        )
    }
}

export default Home;

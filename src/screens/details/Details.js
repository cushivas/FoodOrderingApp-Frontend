import { Component } from 'react';
import './Details.css'
import Header from '../../common/header/Header';

class Details extends Component {
    constructor(props) {
        super(props);
        const routeData = props.location.state.id;
        this.state = {
            id: routeData
        }; // Read values passed on state
    }

    render() {
        return (
            <div>
                <Header
                    screen={"Details"}
                ></Header>
            </div>
        )
    }
}

export default Details;


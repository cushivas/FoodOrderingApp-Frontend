import { Component } from 'react';
import Header from '../../common/header/Header';
import RestaurantCard from '../../common/restaurant-card/Restaurant-card'
import './Home.css';
import {withStyles} from '@material-ui/core/styles';
import HTTPRequestHandler from '../../common/Http-handler';


const homeStyles =  theme => ({
    card: {
      maxWidth: 1100,
    },
    avatar: {
      margin: 10,
    },
    media: {
      height:0,
      paddingTop: '56.25%',
    },
    formControl: {
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'baseline',
    },
    comment:{
      display:'flex',
      alignItems:'center',
    },
    hr:{
      marginTop:'10px',
      borderTop:'2px solid #f2f2f2'
    },
    gridList:{
      width: 1100,
      height: 'auto',
      overflowY: 'auto',
    },
    grid:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      marginTop:90
    }
  });

class Home extends Component {

    
    constructor(props) {
        super(props);
    }


    async componentDidMount() {
      await HTTPRequestHandler.getAllRestaurants().then(res => {
        console.log(res.json());
      })
    }

    /**
     * 
     * @param {*} value 
     */
    onSearchEntered = (value) =>{
        // Do something here
    }



    /**
     * 
     * @returns 
     */

    render() {
        const{classes} = this.props;
        return(
            <div>
                <Header 
                screen={"Home"}
                searchHandler={this.onSearchEntered}
                ></Header>
                <div className={classes.grid}>
                    <RestaurantCard/>
                </div>
            </div>
        )
    }
}

export default withStyles(homeStyles)(Home);

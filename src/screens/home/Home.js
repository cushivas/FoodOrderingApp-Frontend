
import Header from '../../common/header/Header';
import './Home.css';
import { withStyles } from '@material-ui/core/styles';
import HTTPRequestHandler from '../../common/Http-handler';
import GridList from '@material-ui/core/GridList';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';


const homeStyles = theme => ({
  card: {
    maxWidth: 1100,
  },
  avatar: {
    margin: 10,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
  },
  hr: {
    marginTop: '10px',
    borderTop: '2px solid #f2f2f2'
  },
  gridList: {
    width: '100%',
    height: 'auto',
    overflowY: 'auto',
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 90
  },
  cardroot: {
    maxWidth: 320,
    margin: '0.75rem 1rem 0.75rem 1rem'
  },
  images: {
    height: 140,

  },
  button: {
    margin: theme.spacing(1),
  },
  postfooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '10px'
  }
});

class Home extends Component {


  constructor(props) {
    super(props);
    this.state = {
      filteredData: [],
      originalData: [],
    }
  }


  async componentDidMount() {
    await HTTPRequestHandler.getAllRestaurants().then(res => {
      let responseArray = res.restaurants;
      responseArray = responseArray.sort((a, b) => a.customer_rating < b.customer_rating ? 1 : -1);
      this.setState({
        filteredData: responseArray,
        originalData: responseArray,
      })
    })
  }

  /**
   * Filter Restaurant list based on user search criteria
   * @param {*} value 
   */
  onSearchEntered = (value) => {
    console.log('search value', value);
    let filteredData = this.state.originalData;
    filteredData = filteredData.filter((data) => {
      return data.restaurant_name.toLowerCase().includes(value.toLowerCase());
    })
    this.setState({
      filteredData: filteredData
    })
  }

  handleCardClick = (cardData) => {
    console.log(cardData)
    this.props.history.push('/restaurant/'+ cardData.id , { id: cardData.id });
  }



  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          screen={"Home"}
          searchHandler={this.onSearchEntered}
        ></Header>

        <div className={classes.grid}>
          <GridList className={classes.gridList} cellHeight={'auto'}>
            {this.state.filteredData.map(data => (
              <Card className={classes.cardroot} key={data.id} onClick={this.handleCardClick.bind(this, data)}>
                <CardActionArea>
                  <CardMedia className={classes.images} style={{ borderRadius: '5px' }}
                    image={data.photo_URL}
                    title={data.restaurant_name}></CardMedia>
                  <CardContent style={{ height: "80px" }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {data.restaurant_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {data.categories}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions className={classes.postfooter}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: 'yellowgreen', color: '#fff' }}
                    className={classes.button}
                    startIcon={<StarIcon />}>
                    {data.customer_rating} ({data.number_customers_rated})
                  </Button>
                  <div>
                    <i className="fa fa-inr" aria-hidden="true">
                      <span> {data.average_price} for two</span>
                    </i>
                  </div>
                </CardActions>

              </Card>
            ))}

          </GridList>
        </div>

      </div>
    )
  }
}

export default withStyles(homeStyles)(Home);

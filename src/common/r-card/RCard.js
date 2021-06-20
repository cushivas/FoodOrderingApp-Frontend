import './RCard.css';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star'; 

const cardStyles = theme =>({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  button: {
    margin: theme.spacing(1),
  }
});


class RCard extends Component {

    constructor() {
        super();
    }

    render() {
        const { data , classes } = this.props;
        return(
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Shivsagar restaurant"></CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Shivsagar restaurant
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                <Button
                    variant="contained"
                    style={{backgroundColor:'yellowgreen', color:'#fff'}}
                    className={classes.button}
                    startIcon={<StarIcon />}>
                    4.2 (2000)
                </Button>
                <Button>
                    Learn More
                </Button>
                </CardActions>

            </Card>
        );
    }

}


export default withStyles(cardStyles)(RCard);




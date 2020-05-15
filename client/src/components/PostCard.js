import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import paperTexture from '../assets/paper2.jpg';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PostOptions from './PostOptions';
import './PostCard.scss';

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    fontSize: "2rem",
  },
}));

export default function PostCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="card" style={{background: "#031e11"}}>
      <CardHeader className="typing"
        avatar={
          // <Avatar aria-label="recipe" className={classes.avatar}>
            <div className={classes.avatar}>
              {`[${props.post.author}]`}
            </div>
          // </Avatar>
        }
        action={
          <PostOptions post={props.post}/>
        }
        title={props.post.title}
        titleTypographyProps={{variant: "h5", style: {fontFamily: 'Lobster, cursive', color: "#58c1d1"}}}
        subheader={`${props.post.created_at}${props.post.updated_at !== "" ? `(Updated ${props.post.updated_at})` : ""}`}
        subheaderTypographyProps={{color: "#14fdce"}}
      />
      <CardContent className="typing">
        <div dangerouslySetInnerHTML={{ __html: props.post.text }} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>

        </CardContent>
      </Collapse>
    </Card>
  );
}

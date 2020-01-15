import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    postContainer: {
        maxWidth: "80%",
        margin: "2% auto",
    }
}));

function Home() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/api/posts',
            withCredentials: true,
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then(function (response) {
                //handle success
                let { data } = response;
                console.log(data);
                setPosts(data.posts);
            })
            .catch(function (error) {
                //handle error
            });
    }, []);
    return (
        <div className={classes.postContainer}>
            {posts.slice(0).reverse().map((value, index) => {
                return <PostCard post={value} />
            })}
        </div>
    );
}

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}



export { Home, About, Users }

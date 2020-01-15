import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { post } from '../redux/actions/post';
import { title } from '../redux/actions/title';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    postContainer: {
        height: "100%",
    },
    root: {
        padding: theme.spacing(3, 2),
        position: "relative",
        height: "auto"
    },
    textField: {
        marginBottom: theme.spacing(1)
    },
}));

function New(props) {
    const classes = useStyles();
    const handleChange = (event, editor) => {
        const data = editor.getData();
        props.post(data);
    }
    const handleTitleChange = event => {
        props.title(event.target.value);
    }
    const handlePost = () => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/posts',
            data: {
                "author": props.authorization.username,
                "text": props.newPost.content,
                "likes": 0,
                "comments": 0,
                "created_at": "",
                "updated_at": "",
                "title": props.titleChange
            },
            withCredentials: true,
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then(function (response) {
                //handle success
                let { data } = response;
                console.log(data);
            })
            .catch(function (error) {
                //handle error
            });
    }
    return (
        <div className={classes.postContainer}>
            <Paper className={classes.root} style={{ width: "60%", margin: "5% auto" }}>
                <TextField
                    id="outlined-textarea"
                    label="Post Title"
                    multiline
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    onChange={handleTitleChange}
                    defaultValue={props.titleChange}
                    fullWidth
                />
                <CKEditor
                    editor={DecoupledEditor}
                    data={props.newPost.content}
                    onInit={editor => {
                        editor.ui.getEditableElement().parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement()
                        );
                        editor.editing.view.focus();
                    }}
                    onChange={handleChange}
                    onBlur={(event, editor) => {

                    }}
                    onFocus={(event, editor) => {

                    }}
                />
                <Button style={{ marginTop: "2%" }} onClick={handlePost} variant="contained" size="large" color="primary">Post</Button>
            </Paper>
        </div>

    )
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    post: data => dispatch(post(data)),
    title: data => dispatch(title(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(New)
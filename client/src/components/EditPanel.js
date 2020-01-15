import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { edit } from '../redux/actions/edit';
import { editTitle } from '../redux/actions/editTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
    textField: {
        marginBottom: theme.spacing(1)
    },
}));

function EditPanel(props) {
    const classes = useStyles();
    const handleChange = (event, editor) => {
        const data = editor.getData();
        props.edit(data);
    }
    const handleTitleEdit = event => {
        props.editTitle(event.target.value);
    }
    const handleEdit = () => {
        axios({
            method: 'put',
            url: `http://127.0.0.1:8000/api/posts/${props.currentPost.id}`,
            data: {
                "author": props.authorization.username,
                "text": props.editedPost.content,
                "likes": props.currentPost.likes,
                "comments": props.currentPost.comments,
                "created_at": "",
                "updated_at": "",
                "title": props.titleEdited
            },
            withCredentials: true,
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then(function (response) {
                //handle success
                let { data } = response;
                console.log(data);
                window.location.href = window.location.href;
            })
            .catch(function (error) {
                //handle error
            });
    }
    return (
        <Paper className={classes.root} style={{ width: "60%", margin: "5% auto" }}>
            <TextField
                id="outlined-textarea"
                label="Post Title"
                multiline
                className={classes.textField}
                margin="normal"
                variant="outlined"
                onChange={handleTitleEdit}
                defaultValue={props.currentPost.title}
                fullWidth
            />
            <CKEditor
                editor={DecoupledEditor}
                data={props.currentPost.text}
                onInit={editor => {
                    editor.ui.getEditableElement().parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                    );
                    editor.editing.view.focus()
                }}
                onChange={handleChange}
                onBlur={(event, editor) => {

                }}
                onFocus={(event, editor) => {

                }}
            />
            <Button style={{ marginTop: "2%" }} onClick={handleEdit} variant="contained" size="large" color="primary">Save Changes</Button>
        </Paper>
    )
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    edit: data => dispatch(edit(data)),
    editTitle: data => dispatch(editTitle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPanel)
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authorization from './authorization';
import newPost from './newPost';
import titleChange from './titleChange';
import editedPost from './editedPost';
import titleEdited from './titleEdited';
export default combineReducers({
 authorization,
 newPost,
 titleChange,
 editedPost,
 titleEdited,
 form: formReducer
});
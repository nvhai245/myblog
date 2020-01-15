export const editTitle = data => dispatch => {
    dispatch({
     type: 'EDIT_TITLE',
     payload: data
    })
}
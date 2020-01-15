export const title = data => dispatch => {
    dispatch({
     type: 'TITLE',
     payload: data
    })
}
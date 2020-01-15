export const post = data => dispatch => {
    dispatch({
     type: 'POST',
     payload: { content: data }
    })
   }
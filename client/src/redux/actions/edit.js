export const edit = data => dispatch => {
    dispatch({
        type: 'EDIT',
        payload: { content: data }
    })
}
export default (state = {}, action) => {
    switch (action.type) {
        case 'EDIT_TITLE':
            return action.payload
        default:
            return state
    }
}
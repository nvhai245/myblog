export default (state = {}, action) => {
    switch (action.type) {
        case 'TITLE':
            return action.payload
        default:
            return state
    }
}
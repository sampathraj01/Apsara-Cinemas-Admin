const initialOrder = {
    orders: [],
    singleorders: [],
    ordermessages : {}
};

const orderReducer = (order = initialOrder, action) => {
    switch (action.type) {
        case 'GET_ORDER':
            return {
                ...order, orders: action.payload.data
            };
        case "GET_SINGLE_ORDER":
            return {
                ...order, singleorders: action.payload.data
            };
        default:return order;

    }
}
export default orderReducer;
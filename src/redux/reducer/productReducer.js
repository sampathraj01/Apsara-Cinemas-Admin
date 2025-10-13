const initialState = {
    products: [],
    productmessages:{}
};

const productReducer = (product = initialState, action) => {
    switch (action.type) {
        case 'GET_PRODUCT':
            return {
                ...product, products: action.payload.data
            };
            case "ADD_PRODUCT":
              return {
                ...product, productmessages: action.payload.data
            };
            case 'UPDATE_PRODUCT':
              return {
                ...product, productmessages: action.payload.data
            };
            case 'UPDATE_PRODUCT_STOCK':
              return{
                ...product, productmessages: action.payload.data
              };
          default:
            return product;
    }
}
export default productReducer;
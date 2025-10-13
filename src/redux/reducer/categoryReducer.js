const initialState = {
    categories: [],
    categorymessages:{}
};

const categoryReducer = (category = initialState, action) => {
    switch (action.type) {
        case 'GET_CATEGORY':
            return {
                ...category, categories: action.payload.data
            };
            case "ADD_CATEGORY":
              return {
                ...category, categorymessages: action.payload.data
            };
            case 'UPDATE_CATEGORY':
              return {
                ...category, categorymessages: action.payload.data
            };
          default:
            return category;
    }
}
export default categoryReducer;
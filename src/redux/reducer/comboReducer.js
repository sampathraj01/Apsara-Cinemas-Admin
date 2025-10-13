const initialState = {
    combos: [],
    combomessages:{}
};

const comboReducer = (combo = initialState, action) => {
    switch (action.type) {
        case 'GET_COMBO':
            return {
                ...combo, combos: action.payload.data
            };
            case "ADD_COMBO":
              return {
                ...combo, combomessages: action.payload.data
            };
            case 'UPDATE_COMBO':
              return {
                ...combo, combomessages: action.payload.data
            };
            case 'UPDATE_COMBO_STOCK':
              return{
                 ...combo, combomessages: action.payload.data
              }
          default:
            return combo;
    }
}
export default comboReducer;
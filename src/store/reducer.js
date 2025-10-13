// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
// import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
// import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';

//master mens
import categoryReducer from '../redux/reducer/categoryReducer';
import productReducer from '../redux/reducer/productReducer';
import comboReducer from 'redux/reducer/comboReducer';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    // customer: customerReducer,
    contact: contactReducer,

  
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    menu: menuReducer,

    category: categoryReducer,
    categorymessage : categoryReducer,

    product: productReducer,
    productmessage: productReducer,

    combo: comboReducer,
    combomessage: comboReducer,
    
});

export default reducer;

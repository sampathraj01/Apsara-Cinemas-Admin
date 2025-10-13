import * as Constants from './constants';
import { ListUserModel } from '../../models/userModel';

export interface UserState {

    loading: boolean | undefined,
    addUserSuccedeed: boolean | undefined,

}

const initialState: UserState = {

    loading: undefined,
    addUserSuccedeed: undefined,

}

function userReducer(state: UserState = initialState, action: any) {
    switch (action.type) {

        case Constants.addUserActionType: return addUserAction(state, action);
        case Constants.addUserSuccessType: return addUserSuccessAction(state, action);
        case Constants.addUserFailureType: return addUserFailureAction(state, action);

        default: return state;

    }

}


function addUserAction(state: UserState, action: any): UserState {
    if (action.payload) {
        return {
            ...state,
            loading: true,
            addUserSuccedeed: undefined,
        };
    }
    return state;
}

function addUserSuccessAction(state: UserState, action: any): UserState {
    return {
        ...state,
        loading: false,
        addUserSuccedeed: true,
    };
}

function addUserFailureAction(state: UserState, action: any): UserState {
    return {
        ...state,
        loading: false,
        addUserSuccedeed: false,
    };
}


export default userReducer
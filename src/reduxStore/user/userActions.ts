import { useMemo } from 'react';
import * as Constants from './constants';
import { bindActionCreators, Dispatch } from "redux";
import { Action, ActionCreator } from '../../models/actions';
import { UserFormModel, SwitchManageUserModel, UserActionModel } from '../../models/userModel';

export namespace UserActions {

    export type addUserRequestAction = Action<typeof Constants.addUserActionType, UserFormModel>
    export type addUserSuccessAction = Action<typeof Constants.addUserSuccessType, any>;
    export type addUserFailureAction = Action<typeof Constants.addUserFailureType, any>;

    export function addUserRequest(P: UserFormModel): addUserRequestAction {
        return ActionCreator(Constants.addUserActionType, P);
    }
    export function addUserRequestSuccess(P: any): addUserSuccessAction {
        return ActionCreator(Constants.addUserSuccessType, P);
    }
    export function addUserRequestFailure(P: any): addUserFailureAction {
        return ActionCreator(Constants.addUserFailureType, P);
    }

}

export type UserActions = Omit<typeof UserActions, 'Type'>;

export const useUserActions = (dispatch: Dispatch) => {
    const { ...actions } = UserActions;
    return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as UserActions;
};
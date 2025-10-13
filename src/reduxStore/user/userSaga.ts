import * as Constants from './constants'
import { all, put, takeEvery } from '@redux-saga/core/effects';

import ApiService from "../../api/apiService";
import VerifyResponse from "../../models/verifyResponse";
import { UserActions } from "./userActions";


function* asyncAddUser(payload: any) {
    try {
        const response: VerifyResponse = yield ApiService.addUser(payload.payload);
        if (response != undefined) {
            yield put(UserActions.addUserRequestSuccess(response.data));
        }
    } catch (error:any) {
        yield put(UserActions.addUserRequestFailure(error.response.data));
    }
}

export function* userSaga() {
    yield all([
        takeEvery(Constants.addUserActionType, asyncAddUser),
    ]);
}
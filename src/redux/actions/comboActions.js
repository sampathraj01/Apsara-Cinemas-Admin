import axios from '../../utils/axios'
import { dispatch } from "../../store/index";

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

export function getCombos() {
    return async () => {
        console.log('process.env.LOCAL_API_URL',process.env.REACT_APP_LOCAL_API_URL)
        const getComboResponse = await axios
            .get(`${API_URL}combo/get`)
            .catch((err) => {
                console.log('err', err)
            })
            console.log('getComboResponse',getComboResponse)
        if (getComboResponse && getComboResponse.data) {
            dispatch({
                type: "GET_COMBO",
                payload: {
                    data: getComboResponse.data.data,
                },
            });

        }else{
            dispatch({
                type: "ADD_COMBO",
                payload: {
                    data: error,
                },
            });
        }
    };
}


export const addCombo = (data) => {
    return async () => {
        var error = {}
        const addComboResponse = await axios
            .post(`${API_URL}combo/add`,data)
            .catch((err) => {
                error = err.response.data
            });
        
        if (addComboResponse && addComboResponse.data) {
            dispatch({
                type: "ADD_COMBO",
                payload: {
                    data: addComboResponse.data,
                },
            });
        } else {
            dispatch({
                type: "ADD_COMBO",
                payload: {
                    data: error,
                },
            });
        }        

    };
};

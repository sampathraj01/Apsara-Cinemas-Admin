import axios from '../../utils/axios'
import { dispatch } from "../../store/index";

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

export function getCategories() {
    return async () => {
        console.log('process.env.LOCAL_API_URL',process.env.REACT_APP_LOCAL_API_URL)
        const getCategoriesResponse = await axios
            .get(`${API_URL}category/get`)
            .catch((err) => {
                console.log('err', err)
            })
            console.log('getCategoriesResponse',getCategoriesResponse)
        if (getCategoriesResponse && getCategoriesResponse.data) {
            dispatch({
                type: "GET_CATEGORY",
                payload: {
                    data: getCategoriesResponse.data.data,
                },
            });

        }else{
            dispatch({
                type: "ADD_CATEGORY",
                payload: {
                    data: error,
                },
            });
        }
    };
}


export const addCategory = (data) => {
    return async () => {
        var error = {}
        const addCategoryResponse = await axios
            .post(`${API_URL}category/add`,data)
            .catch((err) => {
                error = err.response.data
            });
        
        if (addCategoryResponse && addCategoryResponse.data) {
            dispatch({
                type: "ADD_CATEGORY",
                payload: {
                    data: addCategoryResponse.data,
                },
            });
        } else {
            dispatch({
                type: "ADD_CATEGORY",
                payload: {
                    data: error,
                },
            });
        }        

    };
};

export const updateCategory = (data) => {
    return async () => {
        var error = {}
        const updateCategoryResponse = await axios
            .put(`${API_URL}category/${data.id}`,data)
            .catch((err) => {
                error = err.response.data
            });

            if (updateCategoryResponse && updateCategoryResponse.data) {
                dispatch({
                    type: "UPDATE_CATEGORY",
                    payload: {
                        data: updateCategoryResponse.data,
                    },
                });
            } else {
                dispatch({
                    type: "UPDATE_CATEGORY",
                    payload: {
                        data: error,
                    },
                });
            }      
        
    };
};
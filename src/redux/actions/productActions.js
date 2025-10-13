import axios from '../../utils/axios'
import { dispatch } from "../../store/index";

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

export function getProducts() {
    return async () => {
        console.log('process.env.LOCAL_API_URL',process.env.REACT_APP_LOCAL_API_URL)
        const getProductResponse = await axios
            .get(`${API_URL}product/get`)
            .catch((err) => {
                console.log('err', err)
            })
            console.log('getProductResponse',getProductResponse)
        if (getProductResponse && getProductResponse.data) {
            dispatch({
                type: "GET_PRODUCT",
                payload: {
                    data: getProductResponse.data.data,
                },
            });

        }else{
            dispatch({
                type: "ADD_PRODUCT",
                payload: {
                    data: error,
                },
            });
        }
    };
}


export const addProduct = (data) => {
    return async () => {
        var error = {}
        const addProductResponse = await axios
            .post(`${API_URL}product/add`,data)
            .catch((err) => {
                error = err.response.data
            });
        
        if (addProductResponse && addProductResponse.data) {
            dispatch({
                type: "ADD_PRODUCT",
                payload: {
                    data: addProductResponse.data,
                },
            });
        } else {
            dispatch({
                type: "ADD_PRODUCT",
                payload: {
                    data: error,
                },
            });
        }        

    };
};

export const updateProduct = (data) => {
    return async () => {
        var error = {}
        const updateProductResponse = await axios
            .put(`${API_URL}product/${data.productid}`,data)
            .catch((err) => {
                error = err.response.data
            });

            if (updateProductResponse && updateProductResponse.data) {
                dispatch({
                    type: "UPDATE_PRODUCT",
                    payload: {
                        data: updateProductResponse.data,
                    },
                });
            } else {
                dispatch({
                    type: "UPDATE_PRODUCT",
                    payload: {
                        data: error,
                    },
                });
            }      
        
    };
};

export const updateStockStatus = (productid, flag) => {
    return async () => {
        let error = {};
        const response = await axios
            .put(`${API_URL}product/updatestockstatus/${productid}`, { flag })
            .catch((err) => {
                error = err.response?.data || { success: false, message: 'Unknown error' };
            });

        if (response && response.data) {
            dispatch({
                type: "UPDATE_PRODUCT_STOCK",
                payload: {
                    data: response.data,
                },
            });
        } else {
            dispatch({
                type: "UPDATE_PRODUCT_STOCK",
                payload: {
                    data: error,
                },
            });
        }
    };
};

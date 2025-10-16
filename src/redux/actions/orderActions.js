import axios from '../../utils/axios'
import { dispatch } from "../../store/index";

const API_URL = process.env.REACT_APP_LOCAL_API_URL;


export function getOrder(data) {
    return async () => {

        const orderResponse = await axios
            .post(`${API_URL}order/getallorder`,data)
            .catch((err) => {
                console.log('err', err)
            })
            console.log('orderResponse',orderResponse)

        if (orderResponse.data) {
            dispatch({
                type: "GET_ORDER",
                payload: {
                    data: orderResponse.data.data,
                },
            });
        }

    };
}
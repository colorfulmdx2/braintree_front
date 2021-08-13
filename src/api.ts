import Axios from 'axios';
const axios = Axios.create({});

export const getClientToken = async () => {
    return axios.get('http://localhost:3015/initializeBraintree').then((res) => res.data)
}
export const makePayment = async (data: any) => {
    return axios.post('http://localhost:3015/initializeBraintree', data).then((res) => res.data)
}
import axios from 'axios'

const api = axios.create({
    //precisa acaber com /
    baseURL: 'https://api.faustocintra.com.br/'
})

export default api
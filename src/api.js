import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.faustocintra.com.br/'
})

export default api
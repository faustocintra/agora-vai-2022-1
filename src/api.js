import axios from 'axios'

const api = axios.create({
    // Precisa terminar com /
    baseURL: 'https://api.faustocintra.com.br/'  
})

export default api
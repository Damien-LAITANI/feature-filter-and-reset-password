import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://cat_to_home.local/wp-json/wp/v2',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: 3000
});

export default {
    // permet de récupérer toutes les fiches adotpions de chats
    async findAll() {
        try {
            apiClient.defaults.headers.common['Authorization'] = '';
            const response = await apiClient.get("/cat?_embed");
            return response.data;
        } catch (error) {
            return error.response;
        }
        
    },
    
    async findAllByOrder(params) {
        try {
            const response = await apiClient.get('/cat?_embed&order=' + params);
            return response.data;
        } catch (error) {
            return error.response;
        }
    },

    // Permet de récupérer une fiche adoption de chat avec son ID
    async find(id) {
        try{
            const response = await apiClient.get("/cat/" + id + "?_embed");
            return response.data
        } catch(error) {
            return error.response.data
        }    
    },

    // Récupère les IDs des fiches en fonction de l'age mis en param
    async findAllByAge(param) {
        try{
            const response = await apiClient.get("/cat/filter/" + param);
            return response.data
        } catch(error) {
            return error.response.data
        }    
    },
    // Récupère les IDs des fiches en fonction de l'age mis en param
    async findAllByIds(param) {
        try{
            const response = await apiClient.get("/cat?_embed&include=" + param);
            return response.data
        } catch(error) {
            return error.response.data
        }    
    },

    async delete(id){
        try{
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
            const response = await apiClient.delete('/cat/' + id);
            return response.data
        } catch(error) {
            return error.response.data
        }
    },

    async update(id, params){
        try{
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
            const response = await apiClient.post('/cat/' + id, params);
            return response.data
        } catch(error) {
            return error.response.data
        }
    },

    async findByOwnerId(id) {
        try{
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
            const response = await apiClient.get('/cat?_embed&author=' + id);
            return response.data
        } catch(error) {
            return error.response.data
        }
    },

    async findAllForHomepage() {
        try {
            const response = await apiClient.get('/cat?_embed&per_page=6&orderby=date&order=asc');
            return response.data;
        } catch (error) {
            return error.response;
        }
    },
}
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://cat_to_home.local/wp-json/wp/v2',
    Headers: {
        Accept: 'application/json', 
        'Content-Type': 'application/json' 
    },
    timeout: 3000
  });

export default {
    // permet de récupérer toutes les locations
    async findAll() {
        const response = await instance.get("/location?per_page=100");
        return response.data;
    },

    async find(params) {
        try {
            const response = await instance.get('location/' + params);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}

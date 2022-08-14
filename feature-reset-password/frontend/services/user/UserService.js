import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://cat_to_home.local/wp-json',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: 3000
});

export default {
    // permet de créer un nouvel utlisateur
    async register(params) {
        try {
            // Evite le bug de l'inscription après deconnexion qui demandait un token lors de l'inscription
            apiClient.defaults.headers.common['Authorization'] = '';

            const response = await apiClient.post('/wp/v2/users/register', params);
            return response.data
        } catch (error) {
            return error.response.data
        }
    },

    async login(params) {
        try {
            // On remet le Bearer à vide pour evité le bug lors de la modification du mot de passe dans le profil
            // Après la redirection, un token était demandé pour se connecter
            apiClient.defaults.headers.common['Authorization'] = '';

            const response = await apiClient.post('/jwt-auth/v1/token', params);
            return response.data
        } catch (error) {
            return error.response.data
        }
    },
    
    // Recupere les infos de l'utilisateur par id de connexion. 
    async find(id) {
        try {
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token') + '';
            const response = await apiClient.get('/wp/v2/users/' + id + '/?context=edit');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    // Envoi d'un mail pour la réinitialisation de mot de passe
    async send(params) {
        try {
            const response = await apiClient.post('/wp/v2/users/send', params);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    // Récupere les infos de base d'un user sans besoin de token JWT
    async findForResetPass(id) {
        try {
            const response = await apiClient.get('/wp/v2/users/reset/' + id);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    // Modifie le mot de passe 
    async resetPass(params) {
        try {
            const response = await apiClient.post('/wp/v2/users/reset-password', params);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    // Modifie les infos de l'utilisateur par id de connexion. 
    async update(id, params) {
        try {
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token') + '';
            const response = await apiClient.post('/wp/v2/users/' + id, params);
            return response.data
        } catch (error) {
            return error.response.data
        }
    },

    async delete(id, data) {
        try {
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token') + '';
            const response = await apiClient.delete('/wp/v2/users/' + id, {data});
            return response.data
        } catch (error) {
            return error.response.data
        }
    }
}
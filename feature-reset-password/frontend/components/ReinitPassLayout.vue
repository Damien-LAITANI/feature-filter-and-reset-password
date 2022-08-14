<template>
    <main class="main">
        <h1 class="title" >Vous avez oublié votre mot de passe ?</h1>
        <div class="container__inputs">
            <input type="password" v-model="password" class="input form__items" placeholder="nouveau mot de passe">
            <p class="rest__form__fieldset__field__error">{{ errors.password }}</p>
            <input type="password" v-model="passConfirm" class="input form__items" placeholder="confirmer mot de passe">
            <p class="rest__form__fieldset__field__error">{{ errors.confpassword }}</p>
            <button @click="setNewPassword" class="button__orange form__items">Valider</button>
            <p class="rest__form__fieldset__field__error">{{ errors.invalid_reset }}</p>
        </div>
        <div v-if="errors == 'linkExpired' || errors == 'wrongToken'">
            <p class="link__expired">Ce lien a expiré et/ou est faux, merci de recommencer la réinitialisation de votre
                mot de passe.
            </p>
        </div>
        <div v-if="errors == 'failChangePass'">
            <p class="link__expired">La réinitialisation du mot de passe n'a pas pu être éffectuée, merci de recommencer
            </p>
        </div>
    </main>
</template>

<script>
import UserService from '@/services/user/UserService';
export default {
    name: "ReinitPassLayout",
    data() {
        return {
            errors: {},
            password: null,
            passConfirm: null,
            currentDate: new Date().getTime(), // On transforme la current date en timestamps
            token_url: this.$route.query.token,
        }
    },
    methods: {
        async setNewPassword() {
            this.errors = {};

            if (!this.password) {
                this.errors = {...this.errors, password:'Le mot de passe ne doit pas être vide'};
            }
            if (this.password && !this.password.match(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{8,}$/)) {
                this.errors = {...this.errors, password:"Votre mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule et un chiffre"};
            }
            if (!this.passConfirm) {
                this.errors = {...this.errors, confpassword: 'La confirmation du mot de passe ne doit pas être vide'};
            }
            if (this.password && this.passConfirm && this.passConfirm !== this.password) {
                this.errors = {...this.errors, confpassword:'Les mots de passes doivent être identiques'};
            }
            if (Object.keys(this.errors).length === 0) {
                const response = await UserService.findForResetPass(this.$route.query.key);
                if (response.code === 200) {

                    if (Date.parse(response.data[1].meta_value) >= this.currentDate) { // Date.parse() transforme un string en milliseconde depuis le 01/01/1970
                        if (response.data[0].meta_value === this.token_url) {
                            const reset_pass = await UserService.resetPass({
                                "email": response.data[2].meta_value,
                                "password": this.password
                            });
                            if (reset_pass.code === 200) {
                                this.$router.push({ name: 'login' });
                            } else {
                                this.errors = {...this.errors, invalid_reset: 'Le mot de passe n\'a pas pu être réinitialisé'};
                            }
                        } else {
                                this.errors = {...this.errors, invalid_reset: 'Le lien n\'est plus valide'};
                        }
                    } else {
                        this.errors = {...this.errors, invalid_reset: 'Le lien n\'est plus valide'};

                    }
                }

            }
        }
    }
}
</script>

<style scoped lang="scss">
@use '../../assets/scss/abstracts/variables/colors';

.main {
    margin-bottom: 17.4rem;

    .title {
        text-align: center;
        margin: 5rem 0;
        color: colors.$color-orange;
    }

    .rest__form__fieldset__field__error {
        color: darkred;
        margin-bottom: 2rem;
        padding-top: 0.5rem;
        font-size: 1rem;
    }

    .container__inputs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .input {
            width: 50%;
        }
    }

    .link__expired {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: -4rem;
    }

    .disabled {
        opacity: 0.5;
    }
}

@media screen and (min-width: 725px) {
    .main {
        .rest__form__fieldset__field__error {
            font-size: 1.5rem;
        }
    }
}
</style>
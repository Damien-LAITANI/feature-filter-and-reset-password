<template>
    <main>
        <section class="connexion">
            <img class="connexion__img" src="../../assets/img/illu_cat_door.png"
                alt="chat devant un portail de voyage spatio-temporel" />

            <div v-on:keyup.enter="login" class="connexion__form">
                <p v-if="message" class="message__autorisation__connexion">
                    {{ message }}
                </p>
                <h2 class="connexion__form__title">Connexion</h2>

                <fieldset class="connexion__form__fieldset">
                    <div class="connexion__form__fieldset__field">
                        <label for="email">Adresse e-mail</label><br />
                        <input v-model="email" class="connexion__form__fieldset__field__input input" type="text" />
                        <p class="inscription__form__fieldset__field__error">
                            {{ loginError.email }}
                        </p>
                    </div>
                    <div class="connexion__form__fieldset__field">
                        <label for="password">Mot de passe</label><br />
                        <input v-model="password" class="connexion__form__fieldset__field__input input"
                            type="password" />
                        <p class="inscription__form__fieldset__field__error">
                            {{ loginError.password }}
                        </p>
                    </div>
                    <div class="center__text">
                        <router-link :to="{ name: 'registration' }" class="btn--reinit__pass">Inscription</router-link>
                        <p class="inline">/</p>
                        <button @click="ShowFormChangePass" class="btn--reinit__pass">
                            Réinitialiser son mot de passe
                        </button>
                    </div>
                    <div class="form__reinit__pass">
                        <input v-model="emailReinitPass" class="connexion__form__fieldset__field__input input"
                            type="email" placeholder="email" />
                        <button @click="sendMail" class="button__orange">Valider</button>
                    </div>
                    <div class="send__fail">
                        <p class="reinit__pass reinit__pass--hidden"></p>
                    </div>
                </fieldset>

                <button v-on:click="login" class="connexion__form__button button__orange--papate">
                    Je me connecte
                </button>
                <p class="inscription__form__fieldset__field__error">
                    {{ loginError.login }}
                </p>
            </div>
        </section>
    </main>
</template>

<script>
import UserService from "@/services/user/UserService";

export default {
    name: "LoginFormLayout",
    data() {
        return {
            loginError: {},
            email: null,
            password: null,
            emailReinitPass: null,
            message: null,
        };
    },
    mounted() {
        if (this.$store.getters.getMessage !== null) {
            this.message = this.$store.getters.getMessage;
            this.$store.commit("deleteMessage");
        }
    },
    methods: {
        async login() {
            this.loginError = {};
            if (!this.email) {
                this.loginError = {
                    ...this.loginError,
                    email: "L'email ne doit pas être vide",
                };
            }

            if (!this.password) {
                this.loginError = {
                    ...this.loginError,
                    password: "Le mot de passe ne doit pas être vide",
                };
            }

            if (Object.keys(this.loginError).length === 0) {
                // Requete Ajax pour connexion utilisateur
                const response = await UserService.login({
                    username: this.email,
                    password: this.password,
                });
                if (response.success === true) {
                    // On execute une mutation pour stocker le token et l'id dans le sessionStorage
                    // Et le synchroniser avec le store afin de rendre notre store.token & store.userId reactif
                    this.$store.commit("setToken", response.data.token);
                    this.$store.commit("setUserId", response.data.id);
                    const roles = await UserService.find(response.data.id);
                    this.$store.commit("setRole", roles.roles[0]);
                    // On fait une redirection
                    this.$router.push({ name: "home" });
                } else {
                    this.loginError = {
                        ...this.loginError,
                        login: "L'email ou le mot de passe ne correspond pas",
                    };
                }
            }
        },
        ShowFormChangePass() {
            const formReInitPass = document.querySelector(".form__reinit__pass");
            formReInitPass.classList.toggle("form__reinit__pass--show");
        },
        async sendMail() {
            if (this.emailReinitPass) {
                const response = await UserService.send({
                    email: this.emailReinitPass,
                });
                this.ShowFormChangePass();
                const message = document.querySelector(".reinit__pass");
                message.classList.remove("reinit__pass--hidden");
                if (response.code === 200) {
                    this.emailReinitPass = null;
                    message.textContent = "Le mail a bien été envoyé";
                } else {
                    message.textContent = "Le mail n'a pas pu être envoyé";
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/abstracts/variables/colors";

.message__autorisation__connexion {
    text-align: center;
    margin-bottom: 2rem;
}

.btn--reinit__pass {
    border: none;
    background-color: colors.$color-bg2;
    color: colors.$color-blue;
    font-size: 1.6rem;
    cursor: pointer;
    padding: 0;
}

.btn--reinit__pass:hover {
    text-decoration: underline;
    opacity: 0.7;
}

.form__reinit__pass,
.reinit__pass--hidden {
    display: none;
}

.form__reinit__pass--show {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
}

.center__text {
    text-align: center;
}

.inline {
    display: inline;
    color: colors.$color-blue;
}
</style>
<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="bg-white p-5 rounded d-flex flex-column mx-auto" style="width: 600px">
            <h1 class="title text-center mb-4">Se connecter </h1>

            <div v-if="loginFailed" class="d-flex justify-content-center invalid-feedback">
                Identifiants incorrects. Veuillez réessayer.
            </div>
            <div class="pt-3">
                <label for="email" class="form-label">Email</label>
                <div>
                    <input v-model="email" id="email" type="email" class="form-control"
                        placeholder="Renseignez votre email" :class="{ 'is-invalid': emailHasError }" />
                    <div v-if="emailHasError" class="invalid-feedback">
                        Veuillez renseigner un email valide.
                    </div>
                </div>
            </div>

            <div class="pt-2">
                <label for="password" class="form-label">Mot de passe</label>
                <div>
                    <input 
                        id="password" 
                        v-model="password" 
                        type="password" 
                        class="form-control"
                        :class="{ 'is-invalid': passwordHasError || loginFailed }" 
                        placeholder="Renseignez votre mot de passe" 
                    />
                    <div v-if="passwordHasError" class="invalid-feedback">
                        Veuillez renseigner un mot de passe.
                    </div>
                </div>
            </div>

            <div class="mt-2 d-flex justify-content-center">
                <div class="text-muted">
                    Utilisez admin@admin.com / admin pour vous connecter.
                </div>
            </div>

            <div class="pt-4 d-flex">
                <button class="btn btn-dark ml-auto" @click="onLogin"> Valider </button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { login } from '../api/auth'

export default {
    name: 'LoginPage',
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            email: '',
            password: '',
            loginFailed: false
        }
    },
    validations() {
        return {
            email: { required, email },
            password: { required }
        }
    },
    computed: {
        passwordHasError() {
            return this.v$.password.$error
        },
        emailHasError() {
            return this.v$.email.$error
        }
    },
    methods: {
        async onLogin() {
            this.v$.$validate();
            if (!this.v$.$invalid) {
                await this.handleLogin()
            }
        },
        async handleLogin() {
            try {
                const { data } = await login({ email: this.email, password: this.password })
                localStorage.setItem('token', data.token)
                this.$router.push('/users')
                this.loginFailed = false
            } catch (e) {
                this.loginFailed = true
            }
        }
    },
}
</script>
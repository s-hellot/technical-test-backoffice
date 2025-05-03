<template>
    <div class="m-3"
         :class="{'loading': loadingSave || loadingDelete}"
    >
        <div class="d-flex">
            <div class="mb-3 flex-grow-1">
                <label for="firstName" class="form-label">Prénom</label>
                <input
                    id="firstName"
                    v-model="newUser.firstName"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.newUser.firstName.$error }"
                />
                <div v-if="v$.newUser.firstName.$error" class="invalid-feedback">
                    Le prénom est requis.
                </div>
            </div>
            <div class="mb-3 ml-3  flex-grow-1">
                <label for="lastName" class="form-label">Nom</label>
                <input
                    id="lastName"
                    v-model="newUser.lastName"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.newUser.lastName.$error }"
                />
                <div v-if="v$.newUser.lastName.$error" class="invalid-feedback">
                    Le nom est requis.
                </div>
            </div>
        </div>

        <div class="d-flex">
            <div class="mb-3 flex-grow-1">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    v-model="newUser.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': v$.newUser.email.$error }"
                />
                <div v-if="v$.newUser.email.$error" class="invalid-feedback">
                    Email invalide.
                </div>
            </div>

            <div class="mb-3 ml-3 flex-grow-1">
                <label for="birthDate" class="form-label">Date de naissance</label>
                <input
                    id="birthDate"
                    v-model="newUser.birthDate"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': v$.newUser.birthDate.$error }"
                />
                <div v-if="v$.newUser.birthDate.$error" class="invalid-feedback">
                    <div v-if="v$.newUser.birthDate.$errors[0]?.$message">
                        {{ v$.newUser.birthDate.$errors[0]?.$message }}
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex">
            <div class="mb-3 flex-grow-1">
                <label for="password" class="form-label">Nouveau mot de passe</label>
                <div class="d-flex"
                    :class="{ 'is-invalid': v$.newUser.password.$error }" 
                >
                    <input 
                        id="password" 
                        v-model="newUser.password" 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control"
                        :class="{ 'is-invalid': v$.newUser.password.$error }" 
                        placeholder="Renseignez votre mot de passe" 
                    />
                    <button
                        type="button"
                        class="btn btn-outline-secondary position-relative ml-3"
                        @click="togglePassword"
                    >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>
                <div v-if="v$.newUser.password.$error" class="invalid-feedback">
                    Veuillez renseigner un mot de passe d'au moins 6 caractères.
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end">
            <div class="d-flex  ml-auto">
                <ConfirmButton 
                    v-if="edit" 
                    :loading="loadingDelete"
                    @confirm="onDelete"
                />
                <button v-if="!edit" class="btn btn-danger" @click="onCancel"> Annuler </button>
                <div>
                    <button class="btn btn-dark ml-3" :disabled="loadingSave" @click="onSubmit">
                        <div v-if="loadingSave">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Chargement...
                        </div>
                        <div v-else>
                            Sauvegarder
                        </div>
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { NewUser, User } from '@/api/user';
import useVuelidate from '@vuelidate/core'
import { updateUser, createUser, deleteUser } from '../api/user'
import type { AxiosResponse } from 'axios';
import { required, email, minLength, helpers } from '@vuelidate/validators'
import ConfirmButton from './ConfirmButton.vue';

export default defineComponent({
    name: 'UserForm',
    components: {
        ConfirmButton
    },
    props: {
        user: {
            type: Object as PropType<User>,
            required: false,
        },
    },
    emits: ['cancel', 'saved', 'deleted'],
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            newUser: {
                firstName: '',
                lastName: '',
                email: '',
                birthDate: '',
                password: ''
            } as NewUser,
            edit: false,
            loadingSave: false,
            loadingDelete: false,
            showPassword: false
        };
    },
    validations() {
        return {
            newUser: {
                firstName: { required },
                lastName: { required },
                email: { required, email },
                birthDate: { 
                    required: helpers.withMessage('La date de naissance est requise.', required), 
                    isValidDate: helpers.withMessage('Date invalide', (value: string) => {
                        const date = new Date(value)
                        const now = new Date()
                        const min = new Date('1900-01-01')
                        return date >= min && date <= now
                    }),
                },
                password: this.edit
                    ? { minLength: minLength(6) }
                    : { required, minLength: minLength(6) }
            },            
        }
    },
    mounted() {
        if (this.user && this.user.id) {
            // should use clone
            this.newUser = { ...this.user };
            this.edit = true
        }
    },
    methods: {
        async onDelete() {
            try {
                this.loadingDelete = true
                await deleteUser(this.user!.id!)
                this.$emit('deleted')
            } finally {
                this.loadingDelete = false
            }
        },
        onCancel() {
            this.$emit('cancel')
        },
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.$invalid) {
                await this.saveUser()
            }
        },
        async saveUser() {
            try {
                this.loadingSave = true
                let response: AxiosResponse;
                if (this.edit) {
                    response = await updateUser(this.user!.id!, this.newUser)
                } else {
                    response = await createUser(this.newUser)
                }
                this.$emit('saved', response.data)
            } finally {
                this.loadingSave = false
            }
        },
        togglePassword() {
            this.showPassword = !this.showPassword
        }
    },
});
</script>
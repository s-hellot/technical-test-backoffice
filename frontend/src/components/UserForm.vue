<template>
    <div class="m-3">
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
                    La date de naissance est requise.
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end">
            <div class="d-flex  ml-auto">
                <button class="btn btn-danger" @click="onCancel"> Annuler </button>
                <button class="btn btn-dark ml-3" @click="onSubmit">
                    <div v-if="loadingSave">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </div>
                    <div v-else>
                        Sauvegarder
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { User } from '@/api/user';
import useVuelidate from '@vuelidate/core'
import { updateUser, createUser } from '../api/user'
import type { AxiosResponse } from 'axios';
import { required, email } from '@vuelidate/validators'

export default defineComponent({
    name: 'UserForm',
    props: {
        user: {
            type: Object as PropType<User>,
            required: false,
        },
    },
    emits: ['cancel', 'saved'],
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
            } as User,
            edit: false,
            loadingSave: false
        };
    },
    validations() {
        return {
            newUser: {
                firstName: { required },
                lastName: { required },
                email: { required, email },
                birthDate: { required },
            },
        }
    },
    mounted() {
        if (this.user) {
            // should use clone
            this.newUser = { ...this.user };
            this.edit = true
        }
    },
    methods: {
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
        }
    },
});
</script>
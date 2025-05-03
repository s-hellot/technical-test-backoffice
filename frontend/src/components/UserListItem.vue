<template>
    <div class="d-flex m-3 align-items-center">
        <div class="icon-container">
            <i class="bi bi-person-circle" style="font-size:48px"></i>
        </div>
        <div class="ml-5 d-flex flex-column">
            <div> {{ user.firstName }} {{ user.lastName }} </div>
            <div class="text-muted"> {{user.email }} - {{ user.birthDate }}</div>
        </div>
        <div class="ml-auto d-flex align-items-center">
            <span class="icon-edit text-primary" 
                  style="cursor: pointer;"
                  @click="onEdit"
            >
                <i class="bi bi-pencil-fill" style="font-size:32px"></i>
            </span>
        </div>
    </div>
    <div v-if="edit">
        <UserForm :user="user" 
                  @cancel="onCancel"
                  @saved="onSaved"  
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type User } from '@/api/user';
import UserForm from './UserForm.vue';

export default defineComponent({
    name: 'UserListItem',
    components: {
        UserForm
    },
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        },
    },
    emits: ['saved'],
    data() {
        return {
            edit: false,
        }
    },
    methods: {
        onEdit() {
            this.edit = true
        },
        onCancel() {
            this.edit = false;
        },
        onSaved(user: User) {
            this.$emit('saved', user);
            this.edit = false;
        }
    }
});
</script>
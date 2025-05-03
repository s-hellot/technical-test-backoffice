<template>
    <div class="d-flex flex-column m-5">
        <div class="title text-center text-white"> Liste des utilisateurs</div>
        <SearchBar class="m-5" v-model="searchQuery" />
        <div v-if="loadingUsers" class="d-flex justify-content-center">
            <div class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div v-for="user in users" :key="user.id" class="my-3 rounded bg-white">
            <UserListItem :user="user" @saved="onSaved" />
        </div>
    </div>
</template>

<script lang="ts">
import UserListItem from '@/components/UserListItem.vue';
import SearchBar from '../components/SearchBar.vue';
import { getUsers, type User } from '@/api/user';

export default {
    name: 'UserListPage',
    components: {
        SearchBar,
        UserListItem
    },
    data() {
        return {
            searchQuery: '',
            users: [] as User[],
            loadingUsers: false
        }
    },
    async created() {
        await this.loadUsers()
    },
    computed: {

    },
    methods: {
        async loadUsers() {
            try {
                this.loadingUsers = true
                const response = await getUsers()
                this.users = response.data
            } finally {
                this.loadingUsers = false
            }
        },
        async onSaved(user: User) {
            this.users = this.users.map(u => u.id === user.id ? user : u);        
        }
    },
}
</script>
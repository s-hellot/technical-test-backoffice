<template>
    <div class="d-flex flex-column m-5">
        <div class="title text-center text-white"> Liste des utilisateurs</div>

        <SearchBar class="m-5" 
            v-model="searchQuery" 
            @input="searchUsers"
        />
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-light" role="status"
                 :style="{ visibility: loadingUsers ? 'visible' : 'hidden' }"
            >
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div class="d-flex my-3 flex-column">
            <div>
                <button class="btn btn-dark" @click="toggleNewForm">
                    + Créer
                </button>
            </div>

            <div v-if="displayNewForm"
                 class="bg-white rounded mt-3"
            >
                <UserForm @cancel="toggleNewForm"
                          @saved="onCreated"
                />
            </div>
        </div>

        <div v-for="user in users" 
             :key="user.id" 
             class="my-3 rounded bg-white"
             :class="{'loading': loadingUsers}"
        >
            <UserListItem :user="user" @saved="onSaved" />
        </div>
    </div>
</template>

<script lang="ts">
import UserListItem from '@/components/UserListItem.vue';
import SearchBar from '../components/SearchBar.vue';
import { getUsers, type User } from '@/api/user';
import UserForm from '@/components/UserForm.vue';

export default {
    name: 'UserListPage',
    components: {
        SearchBar,
        UserListItem,
        UserForm
    },
    data() {
        return {
            searchQuery: '',
            users: [] as User[],
            loadingUsers: false,
            searchTimeout: null as number | null,
            displayNewForm: false
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
                const response = await getUsers(this.searchQuery)
                this.users = response.data
            } finally {
                this.loadingUsers = false
            }
        },
        async onSaved(user: User) {
            this.users = this.users.map(u => u.id === user.id ? user : u);        
        },
        async searchUsers() {
            console.log(this.searchQuery, this.searchTimeout)
            if (this.searchQuery?.length > 2) {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout)
                }
                this.searchTimeout = setTimeout(async () => {
                    await this.loadUsers()
                }, 1500)
            }
        },
        async onCreated() {
            await this.loadUsers()
            this.displayNewForm = false
        },
        toggleNewForm() {
            this.displayNewForm = !this.displayNewForm
        }
    },
}
</script>
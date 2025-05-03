<template>
    <header>
        <div v-if="isLoggedIn"
             class="m-2 d-flex justify-content-end mr-5 w-100"
        >
            <div class="bg-white rounded p-2 d-flex flex-column align-items-center">
                <div class="mb-2 font-weight-light"> 
                    Connecté en tant que <span class="font-weight-normal">{{ user?.firstName }} {{ user?.lastName }}</span>
                </div>
                <button class="btn btn-secondary" @click="logout">Se déconnecter</button>
            </div>
        </div>
    </header>
    <div class="w-100">
        <RouterView />
    </div>
</template>

<script lang="ts">
import {jwtDecode} from "jwt-decode";
import type { User } from "./api/user";

export default {
    name: 'App',
    data() {
        return {
            user: null as User | null,
        };
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.user = jwtDecode(localStorage.getItem('token') as string);
        }
    },
    computed: {
        isLoggedIn() {
            return !!this.user?.email
        }
    },
    watch: {
        $route() {
            this.updateUser();
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.user = null
            this.$router.push('/')
        },
        updateUser() {
            if (localStorage.getItem('token')) {
                this.user = jwtDecode(localStorage.getItem('token') as string);
            } else {
                this.user = null
            }
        },
    },
};
</script>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>

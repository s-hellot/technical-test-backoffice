<template>
    <div>
        <button v-if="!showConfirmation" class="btn btn-danger" @click="onDelete"> Supprimer </button>

        <div v-if="showConfirmation" class="alert alert-warning">
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-danger" :disabled="loading" @click="onConfirmDelete">
                    <div v-if="loading">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Chargement...
                    </div>
                    <div v-else>
                        Confirmer
                    </div>
                </button>
                <button type="button" class="btn btn-secondary ml-2" @click="onCancel">Annuler</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ConfirmButtonModal",
    emits: ['confirm'],
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showConfirmation: false
        }
    },
    methods: {
        onDelete() {
            this.showConfirmation = true
        },
        onConfirmDelete() {
            this.$emit('confirm')
        },
        onCancel() {
            this.showConfirmation = false
        }
    }
})
</script>
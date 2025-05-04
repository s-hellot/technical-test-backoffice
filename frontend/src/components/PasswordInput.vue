<template>
    <div class="d-flex align-items-center">
        <input 
            :id="id"
            :value="modelValue"
            @input="onInput"
            :type="show ? 'text' : 'password'"
            class="form-control"
            :class="{ 'is-invalid': error }" 
            :placeholder="placeholder" 
        />
        <button type="button" class="btn btn-outline-secondary position-relative ml-3" @click="toggle">
            <i :class="show ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
    </div>
</template>

<script lang="ts">
export default {
    name: "PasswordInput",
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        error: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: "password",
        },
        placeholder: {
            type: String,
            default: "Renseignez votre mot de passe",
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            show: false,
        };
    },
    methods: {
        toggle() {
            this.show = !this.show;
        },
        onInput(event: Event) {
            const target = event.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
        }
    },
};
</script>
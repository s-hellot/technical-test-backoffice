<template>
    <div class="input-group mb-3">
        <span class="icon-container">
            <i class="bi bi-search"></i>
        </span>
        <input
            type="text" 
            class="form-control rounded pb-2 pl-5 mr-5"
            :placeholder="placeholder" 
            :value="modelValue"
            @input="onInput"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchBar',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: 'Rechercher...',
        },
    },
    methods: {
        onInput(event: Event) {
            const target = event.target as HTMLInputElement;
            this.$emit('update:modelValue', target.value);
        },
    }
})
</script>

<style>
.icon-container{
    position: relative;
    left: 30px;
    z-index: 10;
    background: transparent;
    color: grey;
    display: flex;
    align-items: center;
    cursor: text;
}
</style>

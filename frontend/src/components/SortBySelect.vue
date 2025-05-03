<template>
    <div>
        <select 
            class="form-control" 
            :value="modelValue"
            @change="onChange"
            style="min-width: 250px;"
        >
            <option value="birthDate">Trier par date de naissance</option>
            <option value="lastName">Trier par nom</option>
            <option value="firstName">Trier par prénom</option>
            <option value="email"> Trier par email</option>
        </select>
    </div>


</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type SortBy } from '@/types/sort';

export default defineComponent({
    name: 'SortBySelect',
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String as PropType<SortBy>,
            default: 'lastName'
        }
    },
    methods: {
        onChange(event: Event) {
            const select = event.target as HTMLInputElement;
            this.$emit('update:modelValue', select.value)
        }
    }
});
</script>
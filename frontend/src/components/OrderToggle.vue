<template>
    <div class="bg-white rounded p-1">
        <span class="icon-edit text-primary" style="cursor: pointer;" @click="toggle">
            <i class="bi" :class="iconClass" style="font-size:20px"></i>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type SortOrder } from '@/types/sort';


export default defineComponent({
    name: 'OrderToggle',
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String as PropType<SortOrder>,
            default: 'asc'
        }
    },
    computed: {
        iconClass() {
            return this.modelValue === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
        },
        getLabel() {
            return this.modelValue === 'asc' ? 'Croissant' : 'Décroissant'
        }
    },
    methods: {
        toggle() {
            const next = this.modelValue === 'asc' ? 'desc' : 'asc';
            this.$emit('update:modelValue', next);
        }
    }
});
</script>
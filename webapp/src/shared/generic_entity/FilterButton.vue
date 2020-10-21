<template>
  <Button @click="showDialog" secondary ico="filter">
    <slot> Filter </slot>
  </Button>
</template>
<script>
export default {
    methods: {
        showDialog() {
            this.$dialog({
                title: 'Filter',
                ico: 'filter',
                form: [
                    { label: 'Field'}
                ]
            })
        }
    }
}
</script>
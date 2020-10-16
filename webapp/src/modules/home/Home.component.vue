<template>
<div>
  <Display ico="house">Home</Display>
  <Display lead>
    home view <strong>works!</strong>
  </Display>

 
</div>
</template>

<script>
export default {
  title: 'Home',
  data: () => ({cont: 0}),
  methods: {
    show() {
      this.$toast('novo toast. ' + this.cont++, 'Error', this.cont % 2 ? 'danger': 'light')
    },
    ver(o) {
      console.log('fechou', o)
    }
  }
};
</script>
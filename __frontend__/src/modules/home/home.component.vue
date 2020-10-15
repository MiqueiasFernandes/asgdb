<template>
  <h1>home view works!</h1>

  <p>
    <Dropdown
      title="Meu dropdown"
      :options="['a', 'b', 'c']"
      @choose="choose"
    />
  </p>

  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-expanded="false"
    >
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>

  <Button sm secondary @click="$alert('prefix', 'message', 'btn', 'dark', 5)">
    alert
  </Button>
  <Button
    lg
    color="warning"
    outline
    @click="$toast('title', 'message', 'detail')"
  >
    toast
  </Button>

  <div v-alert.closeable><strong>warning!</strong> this is a alert.</div>
  <div v-alert:info><strong>show!</strong> this is a alert ok.</div>

  <ul>
    <li><span v-badge>badge</span></li>
    <li><span v-badge:danger.rounded>danger rounded</span></li>
    <li><span v-tooltip="'info'">tooltip</span></li>
    <li><span v-tooltip:bottom="'info'">tooltip bootom</span></li>
    <li><span v-popover="'without content'">popover</span></li>
    <li>
      <span v-popover:bottom="{ title: 'info', content: 'content' }"
        >popover bootom</span
      >
    </li>
    <li>
      <span v-spiner></span><span v-spiner:warning></span
      ><span v-spiner.sm></span><span v-spiner:success.sm></span>
    </li>
    <li>
      <span v-spiner.grow></span><span v-spiner:warning.grow></span
      ><span v-spiner.sm.grow></span><span v-spiner:success.grow.sm></span>
    </li>
  </ul>
</template>

<script>
export default {
  methods: {
    choose(e) {
      console.log(e);
    },
  },
};
</script>
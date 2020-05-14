<template>
  <div class="container">
    <!-- <Tab /> -->
    <Header/>
    <transition name="fade-transform" mode="out-in">
      <main class="main_div">
        <router-view/>
      </main>
    </transition>
    <Footer/>
  </div>
</template>

<script>
  import Header from "@/layouts/Header.vue";
  import Footer from "@/layouts/Footer.vue";

  export default {
    components: {
      Header,
      Footer
    }
  };
</script>

<style scoped>
  .main_div {
    width: 67%;
    min-width: 800px;
    min-height: 720px;
    margin: 43px auto 0 auto;
  }

  .container {
    z-index: 0;
    background-color: rgb(248, 248, 245);
  }

</style>

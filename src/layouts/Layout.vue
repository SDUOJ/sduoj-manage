<template>
  <div class="container">
    <!-- <Tab /> -->
    <Header />
    <transition name="fade-transform" mode="out-in">
      <main class="main_div">
        <router-view />
      </main>
    </transition>
    <Footer />
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
.container {
  z-index: 0;
  background-color: rgb(248, 248, 245);
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.23s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<template>
  <div id="addPicturePage">
    <PictureUpload :picture="true" :onSuccess="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
</script>

<style scoped></style>

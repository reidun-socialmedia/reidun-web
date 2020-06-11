<template>
    <v-carousel >
      <v-carousel-item v-for="(path,index) in this.carouselFiles">
        <img :src="path" alt="el"/>
      </v-carousel-item>
    </v-carousel>

</template>

<script>
    export default {
        name: "bannerCarousel",
        data(){
            return{
                carouselFiles:[]
            }
        },
        beforeMount() {

        }

    }
</script>

<style scoped>

</style>

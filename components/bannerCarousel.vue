<template>
  <div>
    <v-carousel slide showControls v-model="carouselIndex">
      <v-carousel-item v-for="(banner,index) in this.carouselFiles"  >

        <img :src="'/media/user'+banner.path" id="img" />

      </v-carousel-item>
    </v-carousel>
    <v-btn v-if="this.loggedInUser.id === this.targetUserId" @click="changeBanner(carouselIndex)">Change Banner</v-btn>
    <h2>{{carouselIndex}}</h2>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "bannerCarousel",
        props: {
            targetUserId: ''

        },
        data() {
            return {
                carouselFiles: {},
                carouselIndex: null
            }
        },
        methods: {
            getBanners() {
                console.log(this.targetUserId)
                this.$axios.get('/users/banners/' + this.targetUserId).then(res => {
                    this.carouselFiles = res.data.data;

                })
            },
            async changeBanner(bannerFileIndex) {
                let bannerFile = this.carouselFiles[bannerFileIndex];
                const formData = new FormData();
                formData.append("userid", this.loggedInUser.id)
                formData.append("image", bannerFile.path);
                let self = this;
                try {
                    await this.$axios.post('user/changebanner', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'BANNER_UPDATED', {
                            sender: this.loggedInUser
                        })

                        this.bannerChangeDialog = false
                        self.setSnackColor("success");
                        self.setSnack("You have successfully changed banner");
                    })

                } catch (e) {
                    self.setSnackColor("error");
                    self.setSnack("Failed to change banner");
                }
            }
        },
        mounted() {
            this.getBanners();
        },
        computed: {
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),

        }


    }
</script>

<style scoped>

</style>

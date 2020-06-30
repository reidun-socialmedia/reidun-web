<template>
  <div>
    <v-carousel slide showControls>
      <v-carousel-item v-for="(banner,index) in this.carouselFiles" :key="banner.id"  >

        <v-img :src="'/media/user'+banner.path" id="img" >

          <div class="carousel-btn"  v-if="loggedInUser.id === targetUserId && banner.isCurrentBanner === 0">
            <v-btn text @click="changeBanner(banner.id)">Switch Banner</v-btn>
            <v-btn text @click="deleteBanner(banner.id)">Delete Banner</v-btn>
          </div>
        </v-img>

      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "bannerCarousel",
        props: {
            targetUserId: ''

        },
        data() {
            return {
                carouselFiles: {},
                carouselIndex: null,

            }
        },
        methods: {
            getBanners() {
                console.log(this.targetUserId)
                this.$axios.get('/users/banners/' + this.targetUserId).then(res => {
                    this.carouselFiles = res.data.data;
                    this.carouselFiles.sort(function (a,b) {
                        return b.isCurrentBanner - a.isCurrentBanner
                    })
                })
            },
            async changeBanner(bannerId) {

                const data = {newBannerId: bannerId,oldBannerId: this.loggedInUser.banner.id}
                let self = this;
                try {
                    await this.$axios.patch('/user/switchCurrentBanner', data).then(res => {
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'BANNER_UPDATED', {
                            sender: this.loggedInUser
                        })

                        self.setSnackColor("success");
                        self.setSnack("You have successfully changed banner");
                    })

                } catch (e) {
                    self.setSnackColor("error");
                    self.setSnack("Failed to change banner");
                }
            },
            async deleteBanner(bannerId){

                const data = {bannerId: bannerId}
                let self = this;
                try {
                    await this.$axios.delete('/user/banner/delete', {data}).then(res => {
                        self.setSnackColor("success");
                        self.setSnack("You have successfully deleted banner");
                    })

                } catch (e) {
                    self.setSnackColor("error");
                    self.setSnack("Failed to delete banner");
                }
            },
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            })
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
.carousel-btn{
  text-align: center;
  background: rgba(0, 0, 0, 0.3);

}
</style>

<template>
    <v-card>
      <v-card-title>{{$t('notifications_page_mobile.title')}}</v-card-title>
      <v-list v-if="Notifications.length !== 0">
          <v-list-item v-for="(n,i) in Notifications" :key="i">
            <v-list-item-avatar><v-img :src="'/media/avatar/'+n.sender.avatar.path"></v-img></v-list-item-avatar>
            <v-list-item-title>{{getMessage(n.type, n.sender.firstname)}}</v-list-item-title>
            <v-btn text>
              {{$t('notifications_page_mobile.markAsRead')}}
            </v-btn>
          </v-list-item>
      </v-list>
      <v-card-text v-else>
          {{$t('notifications_page_mobile.no_notifications')}}
      </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "notifications",
        data(){
            return {
                Notifications: []
            }
        },
        beforeMount() {
            this.getNotifications()
        },
        mounted(){
            this.$ws.$on('NEW_NOTIFICATION', (e) => this.getNotifications())
            this.$ws.$on('READ_NOTIFICATION', (e) => this.getNotifications())

        },
        methods:{
            async getNotifications() {
                await this.$axios.get('/notifications/all').then(res => {
                        this.Notifications = res.data.data

                }).catch(err => {
                    this.Notifications = []

                })
            },
            formatString(string, variables){
                return vsprintf(string,variables)
            },
            getMessage(type,name) {
                switch (type) {
                    case 'POST_LIKED':
                        return this.formatString(this.$t('default_layout.notifications.post_liked'),[name])
                    case 'POST_DISLIKED':
                        return this.formatString(this.$t('default_layout.notifications.post_disliked'),[name])
                    case 'POST_COMMENTED':
                        return this.formatString(this.$t('default_layout.notifications.post_commented'),[name])
                }
            }
        }
    }
</script>

<style scoped>

</style>

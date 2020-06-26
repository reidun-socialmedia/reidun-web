<template>
  <v-card>
    <v-card-title>
      {{$t("settings.security_log_tab.title")}}
    </v-card-title>

    <v-data-table
      height="170"
      :headers="logHeaders"
      :items="log"
      :items-per-page="itemsPerPage"
      :loading="isLoading"
      :no-data-text="$t('settings.security_log_tab.security_log_headers.no_data')"
    >
      <template v-slot:item.date="{ item }">
        <span>{{ formatDate(item.date)}}</span>
      </template>
    </v-data-table>

  </v-card>

</template>

<script>
  import {mapGetters} from "vuex";
  import moment from "moment";

  export default {
    name: "securityLog",
    data() {
      return {
        log: [],
        logHeaders: [
          {
            text: this.$t("settings.security_log_tab.security_log_headers.event_type"),
            align: 'start',
            sortable: false,
            value: "event_type"
          },
          {
            text: this.$t("settings.security_log_tab.security_log_headers.log"),
            value: "log"
          },
          {
            text: this.$t("settings.security_log_tab.security_log_headers.ip"),
            value: "ip"
          },
          {
            text: this.$t("settings.security_log_tab.security_log_headers.date"),
            value: "date"
          },
          {
            text: this.$t("settings.security_log_tab.security_log_headers.location"),
            value: "location"
          }
        ],
        itemsPerPage: 5,
        isLoading: true

      }
    },
    mounted() {
      this.getSecurityLog(this.loggedInUser.id)
    },
    methods: {
      getSecurityLog(id) {
        this.$axios.get("user/security/log").then(res => {
          this.log = res.data.securityLog
          this.isLoading = false
        })


      },
      formatDate(date) {
        return moment(date).local().format("DD-MM-YYYY HH.mm")

      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser', "userLocale"])
    }
  }
</script>

<style scoped>

</style>

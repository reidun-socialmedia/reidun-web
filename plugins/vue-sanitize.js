import Vue from "vue";

import VueSanitize from "vue-sanitize";
let defaultOptions = {
  allowedTags: ['i', 'b','mark'],

};

Vue.use(VueSanitize,defaultOptions);

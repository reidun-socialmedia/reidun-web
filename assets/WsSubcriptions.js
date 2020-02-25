import Vue from "vue";

const eventTopicSubscription = ()=> {

  let eventSubscription = Vue.ws.socket.getSubscription(`event:default`);

  if (!eventSubscription) {
    eventSubscription = Vue.ws.subscribe(`event:default`);

  }
};

export default async () => {
  return new Promise((resolve, reject) => {
    let split = localStorage.getItem('auth._token.local').split(" ")
    let token = split[1]
    Vue.ws.disconnect()
    Vue.ws.connect(
      {
        wsDomain: "ws://localhost/",
        jwtToken: token
      },
      {
        path: 'api/adonis-ws',
        reconnectionAttempts: 300,
        reconnectionDelay: 5000
      }
    );
    Vue.ws.socket.on("open", () => {
      eventTopicSubscription();
      resolve()
    });
  })
};


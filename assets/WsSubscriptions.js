import Vue from "vue";

const eventTopicSubscriptions = (id)=> {

  let eventSubscription = Vue.ws.socket.getSubscription(`event:${id}`);

  if (!eventSubscription) {
    eventSubscription = Vue.ws.subscribe(`event:${id}`);

  }
  let friendSubscription = Vue.ws.socket.getSubscription(`friends:${id}`);

  if (!friendSubscription) {
    friendSubscription = Vue.ws.subscribe(`friends:${id}`);

  }
};

export default async (id) => {
  return new Promise((resolve, reject) => {
    let split =  localStorage.getItem('auth._token.local').split(" ")
    let token = split[1]
    Vue.ws.disconnect()
    Vue.ws.connect(
      {
        wsDomain: "ws://localhost/ws",
        jwtToken:token
      },
      {
        path: 'adonis-ws',
        reconnectionAttempts: 300,
        reconnectionDelay: 5000
      }
    );
    Vue.ws.socket.on("open", () => {
      eventTopicSubscriptions(id);
      resolve()
    });
  })
};

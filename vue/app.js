import Vue from 'vue'

let app = new Vue({
  template: '<div>{{ hi }}</div>',
  data: {
    hi: 'test'
  }
})

app.$mount('#app')

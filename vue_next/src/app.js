const Vue = require('vue/dist/vue.esm-bundler');

Vue.createApp({
  template: '<div>{{ counter }}</div>',
  // render() {
  //   return Vue.h('div', {}, this.counter)
  // },
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}).mount('#app')

import Vue from 'vue'

let app = new Vue({
  template: '<div @click="handle">count: {{ count }}</div>',
  data: {
    count: 0
  },
  methods: {
    handle() {
      this.count++
    }
  },
  // created () {
  //   console.log('created')
  //   this.count++
  // },
  mounted () {
    console.log('mounted')
    // setTimeout(() => this.count++, 1000)
    console.time('time')
    for (let i = 0; i < 10000000000; i++){}
    console.timeEnd('time')
    this.count++
  }
})

app.$mount('#app')

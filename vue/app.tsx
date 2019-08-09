import Vue, { CreateElement } from 'vue'
import App from './src/1-jsx'

declare namespace JSX {
  interface IntrinsicElements {
    div: any
  }
}

const Root = new Vue({
  data() {
    return { hi: 'test' }
  },
  render (h: CreateElement): any {
    return (
      <div>
        <App />
      </div>
    )
  }
})

Root.$mount('#app')

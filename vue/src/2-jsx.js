import Vue from 'vue'

Vue.component('hello', {
  data () {
    return {
      a: 1
    }
  },
  props: ['text'],
  render () {
    return (
      <div>
        hello, <span>{this.text}</span>
      </div>
    )
  }
})

const test = {
  props: ['text'],
  render(h) {
    return (<span>{this.text}, world</span>)
  }
}

export default Vue.extend({
  render (h) {
    return (
      <div>
        <hello text="world!"  />
        <test text="hello" />
      </div>
    )
  }
})
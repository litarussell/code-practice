class Store {
    constructor(options) {
        this.vm = new Vue({
            data: {
                state: options.state
            }
        })

        let getters = options.getter || {}
        this.getters = {}
        Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get: () => getters[getterName](this.state)
            })
        })

        let mutations = options.mutations || {}
        this.mutations = {}
        Object.keys(mutations).forEach(mutationName => {
            this.mutations[mutationName] = arg => {
                mutations[mutationName](this.state, arg)
            }
        })

        let actions = options.actions || {}
        this.actions = {}
        Object.keys(actions).forEach(actionName => {
            this.actions[actionName] = arg => {
                actions[actionName](this, arg)
            }
        })
    }
    get state() {
        return this.vm.state
    }
    commit = (method, arg) => {
        this.mutations[method](arg)
    }
    dispatch(method, arg) {
        this.actions[method](arg)
    }
}

function install(Vue) {
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.store) {
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}

export default {
    Store,
    install
}
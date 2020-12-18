class _LazyMan {
    constructor(name) {
        this.taskQueue = [];
        this.runTimer = null;
        this.sayHi(name);
    }

    run() {
        if (this.runTimer) {
            clearTimeout(this.runTimer);
        }

        this.runTimer = setTimeout(async () => {
            while (this.taskQueue.length > 0) {
                let fn = this.taskQueue.shift()
                await fn()
            }
            // for (let asyncFun of this.taskQueue) {
            //     await asyncFun()
            // }
            // this.taskQueue.length = 0;
            this.runTimer = null;
        })
        return this;
    }

    sayHi(name) {
        this.taskQueue.push(async () => console.log(`Hi, this is ${name}`));
        return this.run();
    }

    eat(food) {
        this.taskQueue.push(async () => console.log(`Eat ${food}`));
        return this.run();
    }

    sleep(second) {
        this.taskQueue.push(async () => {
            console.log(`Sleep ${second} s`)
            return this._timeout(second)
        });
        return this.run();
    }

    sleepFirst(second) {
        this.taskQueue.unshift(async () => {
            console.log(`Sleep first ${second} s`)
            return this._timeout(second);
        });
        return this.run();
    }

    async _timeout(second) {
        await new Promise(resolve => {
            setTimeout(resolve, second * 1e3);
        })
    }
}


// 测试
var lazyMan = name => new _LazyMan(name)

// lazyMan('Hank');
lazyMan('Hank').sleep(10).eat('dinner');

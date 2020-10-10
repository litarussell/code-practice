import { foo } from "./module"

export class Foo {
  constructor() {
    console.log(foo)
  }
}

namespace Utility {
  export function log(msg: string) {
    console.log(msg);
  }
  export function error(msg: string) {
    console.log(msg);
  }
}

// usage
Utility.log('Call me');
Utility.error('maybe');
import { foo, ProfileState } from "./module"

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

let a: ProfileState = {
  userName: "lita",
  email: "email",
  phone: "133"
}

console.log(a)

class Canvas {
  constructor(parent = document.body, width = 400, height = 400) {
    let obj = document.querySelector("#app");
    if(!obj) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      parent.appendChild(this.canvas);
    } else {
      this.canvas = obj;
    }
      
    this.ctx = this.canvas.getContext("2d");
  }
  sync(state) {
    this.clearDisplay();
    this.drawActors(state.actors);
  }

  clearDisplay() {
    this.ctx.fillStyle = "rgba(255, 255, 255, .4)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawActors(actors) {
    for (let actor of actors) {
      if (actor.type === 'circle') {
        this.drawCircle(actor);
      }
    }
  }

  drawCircle(actor) {
    let p = this.ctx;
    p.beginPath();
    p.arc(actor.position.x, actor.position.y, actor.radius, 0, Math.PI * 2);
    p.closePath();
    p.fillStyle = actor.color;
    p.fill();
  }
}

class Ball {
  constructor(config) {
    Object.assign(this,
      {
        type: 'circle',
        position: new Vector(20, 20),
        velocity: new Vector(5, 3),
        radius: 10,
        color: 'red',
      },
      config
    );
  }
  update(state, time, updateId) {
    if (this.position.x >= state.display.canvas.width || this.position.x <= 0) {
      this.velocity = new Vector(-this.velocity.x, this.velocity.y);
    }
    if (this.position.y >= state.display.canvas.height || this.position.y <= 0) {
      this.velocity = new Vector(this.velocity.x, -this.velocity.y);
    }

    for (let actor of state.actors) {
      if (this === actor) {
        continue;
      }
      const distance = this.position.subtract(actor.position).magnitude;
      if (distance <= this.radius + actor.radius) {
        this.color = 'grey';
        actor.color = 'grey';
      }
    }

    return new Ball({
      ...this,
      position: this.position.add(this.velocity),
    });
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }
  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }
  dotProduct(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }
  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  get direction() {
    return Math.atan2(this.x, this.y);
  }
}

class State {
  constructor(display, actors) {
    this.display = display;
    this.actors = actors;
  }
  update(time) {
    const updateId = Math.floor(Math.random() * 1000000);
    const actors = this.actors.map(actor => actor.update(this, time, updateId));
    return new State(this.display, actors);
  }
}

const runAnimation = animation => {
  let lastTime = null;
  const frame = time => {
    if (lastTime !== null) {
      const timeStep = Math.min(100, time - lastTime) / 1000;

      // return false from animation to stop
      if (animation(timeStep) === false) {
        return;
      }
    }
    lastTime = time;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

const display = new Canvas();
const ball1 = new Ball({
  position: new Vector(40, 100),
  velocity: new Vector(1, 0),
  radius: 20,
});
const ball2 = new Ball({
  position: new Vector(200, 100),
  velocity: new Vector(-1, 0),
  color: 'blue',
});
const actors = [ball1, ball2];
let state = new State(display, actors);
runAnimation(time => {
  state = state.update(time);
  display.sync(state);
});
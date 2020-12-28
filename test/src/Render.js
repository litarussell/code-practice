import React from 'react';

export default class Render extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'world'
        }
    }
    render() {
        const { name } = this.state;
        return <div data-type="test">{`Hello ${name}!`}</div>
    }
}

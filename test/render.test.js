/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import App from './src/Render';

describe('测试', () => {
    test('test', () => {
        expect(1).toBe(1)
    })
});

describe('测试render组件', () => {
    let container = null
    beforeEach(() => {
        container = document.createElement('div');
        document.body.append(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container)
        container.remove();
        container = null;
    });
    test('测试组件加载', () => {
        act(() => {
            render(<App />, container);
        })
        const testNode = container.querySelector('[data-type="test"]');
        expect(testNode.textContent).toBe('Hello world!')
    })
});

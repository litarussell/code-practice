import './css/common.css';
import layer from './components/layer/layer.js';

import txt from './file/test.txt'

console.info(`这是txt文件内容: ${txt}`)

const App = function() {
	console.log(layer);
}

new App();
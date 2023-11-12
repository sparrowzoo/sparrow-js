import React from 'react';
import {renderToString} from 'react-dom/server';
import App from '../src/Son';
const fileSave = require('file-save')

const toDoItemString = renderToString(<App/>);
fileSave('./son.html')
.write(toDoItemString, 'utf8').finish(() => {
        console.log('写入完成');});
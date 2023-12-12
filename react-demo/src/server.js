import React from 'react';
import {renderToString} from 'react-dom/server';
import App from '../src/Son';
import { hydrateRoot } from 'react-dom/client';
// import './index.css';
const fileSave = require('file-save')

const  content=hydrateRoot(document.body, <App/>);
console.log(content);

const toDoItemString = renderToString(<App/>);
console.log(toDoItemString);
fileSave('./son.html')
.write(toDoItemString, 'utf8').finish(() => {
        console.log('写入完成');});

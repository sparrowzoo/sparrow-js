import React from 'react';
import {renderToString} from 'react-dom/server';
import {App} from '../src/App';

const toDoItemString = renderToString(<App/>);
console.log("hello");
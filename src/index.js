import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Webcame from './webcame/Webcame';
import Blurdemo2 from './blurdemo2';
import reportWebVitals from './reportWebVitals';
import Blurdemo1 from './blurdemo1';
import Blurdemo3 from './blurdemo3';
import Blurdemo4 from './blurdemo4';
import VirtualBackground from './virtualBackground';

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Blurdemo3/> */}
    {/* <Webcame/> */}
    {/* <Blurdemo2/> */}
    {/* <Blurdemo1/> */}
    <Blurdemo4/>
    {/* <VirtualBackground/> */}
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

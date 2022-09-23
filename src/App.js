import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

import {v4 as uuid} from 'uuid';
import { Form, Grid, Header, Input, List, Segment, Button } from 'semantic-ui-react';

// 1. NEW: Add some new imports
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import aws_exports from './aws-exports';
import awsconfig from './aws-exports';
import Webcam from "react-webcam";
import Buffer from 'buffer';
import EmployeeDropdown from './employees.js';

Amplify.configure(awsconfig);

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

let captured = false;

function process_clock(result) {
  console.log(result);
  captured = true;
}

async function saveImage(imageSrc, info_tag) {
  try {
    await Storage.put(info_tag + '.jpg', imageSrc, {
      contentType: "image/jpg", // contentType is optional
      ContentEncoding: 'base64'
    }).then((result) => process_clock(result))
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
}

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  const capture = (e, d) => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }
    console.log(e, d.name);
    const info_tag = selectedEmployee + "_" + Date.now() + '_' + d.name
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    saveImage(imageSrc, info_tag);
    this.forceUpdate();
  };

  return (
    <div style={{textAlign: 'center', padding: 20}}>
      <div><EmployeeDropdown changeHandler={(e, data) => {setSelectedEmployee(data.value)}} style={{margin: 10}} /></div>
      
      {imgSrc ?
      (<div>
        <div>Thanks you {selectedEmployee} ! Your time is recorded at: {new Date().toLocaleTimeString()}</div>
        <img src='/images/kitten-in-mug.png' style={{width:'360px', height:'360px'}}/> 
      </div>) 
      :
      (<div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{margin: 10}}
      />
      <div><Button name="in" onClick={capture}>Clock In</Button><Button name="out" onClick={capture}>Clock Out</Button></div>
      </div>)}
    </div>
  );
};


function App() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div className="App">
      <header className="App-header" style={{}}> 
      <span><Clock value={value} /></span>
      </header>
      <WebcamCapture/>

    </div>
  );
}

export default App;

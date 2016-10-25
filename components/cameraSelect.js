import React from 'react';

const CameraSelect = React.createClass({
  getInitialState: function() {
    return ({
      cameraSelected: false,
      availableCams: []
    });
  },

  propTypes: {
    selectCamera: React.PropTypes.func.isRequired,
    character: React.PropTypes.string.isRequired
  },

  componentDidMount:  function () {
    navigator.mediaDevices.enumerateDevices().then(this._gotDevices).catch(err => { console.error(err); });
  },

  _gotDevices: function (deviceInfos) {
    console.log('got devices', deviceInfos);
    for (let i = 0; i < deviceInfos.length; i++) {
      if (deviceInfos[i].kind === 'videoinput') {
        this.state.availableCams.push(deviceInfos[i]);
        console.log(deviceInfos[i]);
        this.setState(this.state);
      }
    }
    // if boxman, choose the back camera automatically (if it is available)
    // I am assuming the back camera is listed second...this should be done with a regex TODO still need to ensure the right camera is chosen
    if (this.props.character === 'boxMan' && this.state.availableCams.length > 0) {
      this.state.availableCams.forEach(cam => {
        if (cam.label.includes('Logitech') || cam.label.includes('back'))
        this.props.selectCamera(cam.deviceId);

      })
    }
    
  },

  _submit: function(evt) {
    evt.preventDefault();
    console.log('event clicked target', evt);
    this.props.selectCamera(evt.target.value);
    // const checkedButton = document.querySelectorAll('.radioBtn:checked');
    // console.log('checkedButton', checkedButton)
    // if (checkedButton.length === 1) {
    //   this.props.selectCamera(checkedButton[0].value);
    // }
  },

  render: function() {
    return (
      <div id="cameraSelect">
        <h1>Choose your camera</h1>
      {this.props.character === 'cameraGuy' ?
        this.state.cameraSelected  ?
        <p>Choose your camera in a second</p> :
        <div id="camera-container">
          {this.state.availableCams.map((deviceInfo, i) => {
              console.log(deviceInfo);
              console.log(deviceInfo.label);
              return (
                <div className="button-container" key={Math.random()}>
                  <button
                    onClick={this._submit}
                    className="camera-button"
                    name="camera"
                    value={deviceInfo.deviceId}
                    label={deviceInfo.label || `camera ${i}`}
                    ref={deviceInfo.label}
                  >
                  {deviceInfo.label ||`camera ${i}`}</button><br />
                </div>
              );
            })}
            {(this.state.availableCams.length === 0) ?
              <p>Make sure the app can access your camera!</p> :
              null
            }
          </div>
        :
        null 
      }
        
      </div>
    );
  }
});

export default CameraSelect;
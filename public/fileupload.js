import React, { Component } from 'react';
import firebase from 'firebase'

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            uploadValue: 0
        };
    }
    render() {
        return (
            <div>
                <progress value={this.state.uploadValue} max="100"></progress>
                <br />
                <input type="file" onChange={this.props.onUpload}></input>
                <br />
                <img width="320" src={this.state.picture} alt=""></img>
            </div>
        );
    }
}

export default FileUpload;
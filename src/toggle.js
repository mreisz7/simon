import React, { Component } from 'react';
import './toggle.css';

class Toggle extends Component {
  render() {
    return (
        <div className="toggleswitch-container">
            <label className="toggle-label" htmlFor={this.props.inputId}>{this.props.children}</label>
            <div className="onoffswitch">
                <input type="checkbox" name={this.props.inputId} className="onoffswitch-checkbox" id={this.props.inputId} onChange={() => this.props.onChange(!this.props.value)} checked={this.props.value} />
                <label className="onoffswitch-label" htmlFor={this.props.inputId}>
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>
        </div>
    );
  }
}

export default Toggle;

import React from 'react';

export default class BodyIndex extends React.Component {
  constructor(){
    super();
    this.state={
      username: 'zhang',
      age:12
    };
  }
  render(){
    return(
      <div>
      <h2>This is body</h2>
      <p>{this.state.username},{this.props.id}</p>
      </div>
    )
  }
}

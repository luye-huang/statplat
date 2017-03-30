import React from 'react';
export default class ComponentList extends React.Component{
  render(){
    console.log(this)
    return(

      <div>
        <h2>this is list{this.props.params.id}</h2>
      </div>
    );
  }
}

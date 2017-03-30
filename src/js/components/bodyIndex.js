import React from 'react';
import ReactMixin from 'react-mixin';
import BodyChild from './bodyChild';
import MixinLog from '../mixins/mixinLog';

const propTypes = {name:'a default name!'};

export default class BodyIndex extends React.Component {
  constructor(){
    super();
    this.state={
      username: 'zhang',
      age:12
    };
  };
  changeUserAge(age){
    this.setState({age:age});
    this.refs.sb.style.color='red';   //不要render之前用
    MixinLog.log();
  };
  changeParentAge(e){
    this.setState({age:e.target.value});
  };
  componentDidMount(){
    console.log('did mount~');
  }
  render(){
    return(
      <div>
        <h2>This is body</h2>
        <p>bodyIndex:{this.state.username},{this.props.id},{this.state.age}</p>
        <input type='button' ref='sb' value='submit' onClick={this.changeUserAge.bind(this,21)}/>
        <BodyChild {...this.props} changeParentAge={this.changeParentAge.bind(this)}/>
      </div>
    )
  }
}

BodyIndex.propTypes={
  // userid: React.PropTypes.number.isRequired
  id: React.PropTypes.number.isRequired,
  name:React.PropTypes.string.isRequired
};

BodyIndex.defaultProps= propTypes;
ReactMixin(BodyIndex.prototype, MixinLog);

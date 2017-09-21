import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    return filteredTasks.map((task) => {
      const showPrivateButton = this.props.currentUser != null

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  addUserToList(){
    const {tasks} = this.props
    const {currentUser} = this.props

    if(tasks[0] && currentUser){
      let userExist = false
      
      tasks.forEach(function(task){
        if(task.username === currentUser.username){
          userExist = true
        }
      })

      if(!userExist){
        Meteor.call('tasks.insert');
      }
    }
  }
 
  render() {
    this.addUserToList()

    return (
      <div className="container">
        <header>
          <h1>Users</h1>

          <AccountsUIWrapper />

        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
import React, { Component } from 'react';
import './Phone/index.scss';

import FontAwesome from 'react-fontawesome';

import classNames from 'classnames';

class Phone extends Component{
  constructor(props){
    super(props);
    this.state = {
      date: {
        dayOfWeek: "",
        month: "",
        day: ""
      },
      newItem: "",
      todoItems: [],
      // todoItems: localStorage.getItem('items'),
      completedTasks: [],
      activeTextButton: false,
      idOfItem: 0
    };

    this.insertText = this.insertText.bind(this);
    this.addItem = this.addItem.bind(this);
    this.createdTasks = this.createdTasks.bind(this);
    this.checkItem = this.checkItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deletedTasks = this.deletedTasks.bind(this);
    this.activateTextField = this.activateTextField.bind(this);
  }

  insertText = (event) => {
    if (!event.target.value.replace(/\s/g, '').length){
      return false;
    } else {
      this.setState({newItem: event.target.value});
    }
  };

  addItem = (event) => {
    console.log('before',this.state.todoItems);
    let idOf = this.state.idOfItem;
    idOf++;
    let newItemText = {
      id: idOf,
      text: "",
      checked: false
    };

    newItemText.text = this.state.newItem;

    if (event.charCode === 13 && newItemText.text.length > 0) {

      this.setState( prevState => ({
        todoItems: [...prevState.todoItems, newItemText],
        newItem: '',
        idOfItem: idOf
      }));
      event.target.value = "";

      // localStorage.setItem(`itemNumb${idOf}`, this.state.todoItems);

      // let items = [];
      // items.push(newItemText);

      localStorage.setItem('items', JSON.stringify(this.state.todoItems));
    };
    console.log('after',this.state);
  };

  createdTasks = () => {
    let countedItem;
    if(this.state.todoItems.length < 10){
      countedItem = '0' + this.state.todoItems.length;
      return(
        <div>{countedItem}</div>
      )
    } else {
      return (
        <div>{this.state.todoItems.length}</div>
      )
    }
  };

  deletedTasks = () => {

    // if(this.state.completedTasks){
    //   // return this.state.completedTasks.length
    //   console.log(this.state.completedTasks.length);
    // }

    let countedItem;
    if(this.state.completedTasks.length < 10){
      countedItem = '0' + this.state.completedTasks.length;
      return(
        <div>{ countedItem }</div>
      )
    } else {
      return (
        <div>{ this.state.completedTasks.length }</div>
      )
    }
  };

  checkItem(some){
    some.checked = !some.checked ;

    let items = this.state.todoItems;

    items.forEach((item) => {
      if (item.text === some.text)
        item.checked =  some.checked;
    });

    this.setState({todoItems: items});

    let completedItems = this.state.todoItems.filter(item =>  item.checked === true );
    this.setState({completedTasks: completedItems});

    // set to local storage
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('checkedItems', JSON.stringify(completedItems));
  };


  componentDidMount(){
    let dateNow = new Date();

    let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthes = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let dayOfWeek = weekDays[dateNow.getDay()],
        day = dateNow.getDate(),
        month = monthes[dateNow.getMonth()];
    let date = {
      ...this.state.date
    };
    date.dayOfWeek = dayOfWeek;
    date.day = day;
    date.month = month;
    this.setState({date});


    // get from local storage
    let items = JSON.parse(localStorage.getItem('items'));
    if(items){
      this.setState({
        todoItems: items,
        idOfItem: items.length
      });
    };


    let checkedItems = JSON.parse(localStorage.getItem('checkedItems'));

    if(checkedItems){
      this.setState({completedTasks: checkedItems});
    }



    let completedItems = this.state.todoItems.filter(item =>  item.checked === true );
    this.setState({completedTasks: completedItems});
    this.deletedTasks();
  };

  deleteItem(itemFrom){
    const updatedList = this.state.todoItems.filter(item => item.text !== itemFrom.text);

    const deletedItems = this.state.completedTasks.filter(item => item.text !== itemFrom.text);
    // this.setState(prevState => ({
    //   todoItems: prevState.todoItems.filter(item => item.text !== itemFrom.text)
    // }));
    this.setState({
      todoItems: updatedList,
      completedTasks: deletedItems
    });

    //  set local storage
    localStorage.setItem('items', JSON.stringify(updatedList));
  };

  activateTextField(){
    this.setState({
      activeTextButton: !this.state.activeTextButton
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  render(){
    let { newItem, activeTextButton } = this.state;

    return(
      <div className="phone">
        <div className="phone__inner">
          <div className="phone__head">
            <b>{this.state.date.dayOfWeek},</b>&nbsp;{this.state.date.day} {this.state.date.month}
          </div>
          <div className="phone__stat">
            <div className="row">
              <div className="phone__column left">
                <b className="stat-count">{ this.createdTasks() }</b>
                <p className="stat-descr">Created tasks</p>
              </div>
              <div className="phone__column right">
                <b className="stat-count">{ this.deletedTasks() }</b>
                <p className="stat-descr">Completed tasks</p>
              </div>
            </div>
          </div>
          <div className="phone__todo-items">
            <ul>
              {
                this.state.todoItems.map((item, i) =>
                    <li className="phone__todo-item" key={i} >
                      <span className="checked">
                        <label htmlFor={`todoItem${i}`}>
                          <input id={`todoItem${i}`} type="checkbox" checked={item.checked} onChange={() => this.checkItem(item)} value={newItem}/>
                          <span className="checkmark"></span>
                        </label>
                      </span>
                      <div className={classNames({'item-to-check': true, 'checked': item.checked})} onClick={() => this.checkItem(item)}>
                        {item.text}
                      </div>
                      {
                        item.checked === true ? <FontAwesome className="trash" name="trash-o" size="2x" onClick={()=>this.deleteItem(item)}/> : false
                      }
                    </li>)
              }
            </ul>
          </div>

          <div className="phone__text">
            <input type="text" className={classNames({'active': activeTextButton})} onChange={this.insertText} onKeyPress={this.addItem}/>
            <button onClick={this.activateTextField}>
              <span>+</span>
            </button>
          </div>

        </div>
      </div>
    )
  }
}

export default Phone;
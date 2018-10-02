import React, { Component } from 'react';
import axios from 'axios';
import capitals from '../../utils/capitals';
import MainpageList from './List';
import MainpageButtonGroup from './ButtonGroup';
import '../../styles/list.css';

class Mainpage extends Component {

  API_KEY = 'f816a9bfdb5f7fdf90b24a686288b114';

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: false
    };
  }

  componentDidMount() {
    let resultArr = [];
    let newCapitals = capitals;

    this.setState({
      isLoading: true
    });

    //check if smth is already in LocalStorage
    if (window.localStorage) {
      let capitalsFromStorage = this.getCitiesFromLocalStorage();
      newCapitals = capitalsFromStorage ? capitals.concat(capitalsFromStorage) : capitals;
    }

    newCapitals.map((item) => {
      let capital = item.capital ? item.capital : item;
      let link = this.getFullLink(capital);
      let weatherPromise = axios.get(link);
      resultArr.push({
        'capital': capital.toLowerCase(),
        'temp': weatherPromise,
        'isTheLowest': false,
        'isTheHighest': false,
        'isVisited': false,
        'isWanted': false
      });
    });

    Promise.all(resultArr.map((item, i) => {
      return item.temp;
    }))
      .then((result) => {
        result.map((item, i) => {
          //will it be a problem? - put into exactly that number which I need
          resultArr[i].temp = Math.round(item.data.main.temp);
        });

        //sort and set the lowest and the highest temperature
        resultArr.sort((a, b) => a.temp - b.temp);
        resultArr[0].isTheLowest = true;
        resultArr[resultArr.length - 1].isTheHighest = true;

        this.setState({
          data: resultArr,
          isLoading: false
        });
      })
      .catch(error => {
        if (error.response.status === 404) {
          alert('The city does not exist, please enter the correct city!')
        } else {
          alert('Something goes wrong, please try again later!')
        }
      });
  }

  toggleAction = (city, prop) => {
    let newArr = this.state.data.map((item) => {

      //item[prop] - returns false because of item.isWanted = false
      if (item.capital.toLowerCase() === city.toLowerCase() && item.hasOwnProperty(prop)) {
        let visitedStatus = item[prop];
        item = { ...item, [prop]: !visitedStatus};
      }
      return item;
    });

    this.setState({
      data: newArr
    });
  };

  handleAdd = () => {
    let newCity = prompt('Add new city').toLowerCase();
    let currentData = this.state.data;
    let listOfCapitals = currentData.map((item) => item.capital);

    if (!newCity) {
      alert('Please, enter something!');
      return;
    }

    if (listOfCapitals.includes(newCity)) {
      alert('Capital is already in a table!');
      return;
    }

    let link = this.getFullLink(newCity);
    let weatherPromise = axios.get(link);
    weatherPromise
        .then(result => {
          let newItem = {
            'capital': newCity,
            'temp': Math.round(result.data.main.temp),
            'isTheLowest': false,
            'isTheHighest': false,
            'isVisited': false,
            'isWanted': false
          };

          if (window.localStorage) {
            this.setNewCityToStorage(newCity);
          }

          currentData.push(newItem);
          currentData.sort((a, b) => a.temp - b.temp);
          //setting theLowest and theHighest to false
          currentData.map((item) => {
            item.isTheLowest = false;
            item.isTheHighest = false;
            return item;
          });

          currentData[0].isTheLowest = true;
          currentData[currentData.length - 1].isTheHighest = true;

          this.setState({
            data: currentData
          });

        })
        .catch(error => {
          if (error.response.status === 404) {
            alert('The city does not exist, please enter the correct city!')
          } else {
            alert('Something goes wrong, please try again later!')
          }
        });
  };

  handleReset = () => {
    if (window.localStorage) {
      let capitalsFromStorage = this.getCitiesFromLocalStorage();
      if (capitalsFromStorage) {
        window.localStorage.clear();
        let dataFromState = this.state.data;
        let filterData = dataFromState.filter((item) => capitalsFromStorage.indexOf(item.capital) === -1);
        this.setState({
          data: filterData
        });
      }
    }
  };

  getApiKey() {
    return this.API_KEY;
  }

  getFullLink(capital) {
    let apiKey = this.getApiKey();
    return `http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${apiKey}`;
  }

  setNewCityToStorage(capital) {
    let oldValues = JSON.parse(localStorage.getItem('capitals'));
    let newValues = [];
    if (oldValues instanceof Array) {
      //how to remove double 'if'
      if (oldValues.includes(capital)) {
        return;
      }

      oldValues.push(capital);
      newValues = oldValues.slice(0); //copy an array;
    } else {
      newValues[0] = capital;
    }
    localStorage.setItem('capitals', JSON.stringify(newValues));
  }

  getCitiesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('capitals'));
  }


  render() {
    const { data, isLoading } = this.state;

    return (
        <div>
          <MainpageList data={data} isLoading={isLoading} toggleAction={this.handleAdd}/>
          <MainpageButtonGroup handleAdd={this.handleAdd} handleReset={this.handleReset}/>
        </div>
    );
  }
};

export default Mainpage;

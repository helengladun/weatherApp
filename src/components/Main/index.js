import React, { Component } from 'react';
import axios from 'axios';
import capitals from '../../utils/capitals';
import MainpageList from './List';
import MainpageButtonGroup from './ButtonGroup';
import FormDialog from './DialogWindow';
import '../../styles/list.css';

class Mainpage extends Component {

  API_KEY = 'f816a9bfdb5f7fdf90b24a686288b114';

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      isDialogOpened: false,
      sortName: '',
      defaultData: []
    };
  }

  componentDidMount() {
    let resultArr = [];
    let newCapitals = capitals;

    //check if smth is already in LocalStorage
    if (window.localStorage) {
      let userCitiesFromStorage = this.getCitiesFromLocalStorage();
      newCapitals = userCitiesFromStorage ? userCitiesFromStorage : capitals;
    }

    newCapitals.length !== 0 && newCapitals.map((item) => {
      let capital = item.capital ? item.capital : item;
      let isVisited = item.isVisited ? item.isVisited : false;
      let isWanted = item.isWanted ? item.isWanted : false;
      let custom = item.custom ? item.custom: false;
      let link = this.getFullLink(capital);
      let weatherPromise = axios.get(link);
      resultArr.push({
        'capital': capital.toLowerCase(),
        'temp': weatherPromise,
        'isTheLowest': false,
        'isTheHighest': false,
        'isVisited': isVisited,
        'isWanted': isWanted,
        'custom': custom
      });
      return resultArr;
    });

    newCapitals.length !== 0 && Promise.all(resultArr.map((item) => {
      return item.temp;
    }))
      .then((result) => {
        result.map((item, i) => {
          resultArr[i].temp = Math.round(item.data.main.temp);
          return resultArr;
        });

        //sort and set the lowest and the highest temperature
        resultArr = this.sortAscByProp(resultArr, 'temp');
        resultArr[0].isTheLowest = true;
        resultArr[resultArr.length - 1].isTheHighest = true;

        this.setState({
          data: resultArr,
          defaultData: resultArr,
          isLoading: false
        });

        if (window.localStorage) {
          localStorage.setItem('cities', JSON.stringify(resultArr));
        }

      })
      .catch(error => {
        if (error.response.status === 404) {
          alert('The city does not exist, please enter the correct city!')
        } else {
          alert('Something goes wrong, please try again later!')
        }
      });
  }

  sortAscByProp(obj, prop) {
    return obj.sort((a, b) => a[prop] > b[prop]);
  }

  sortDescByProp(obj, prop) {
    return obj.sort((a, b) => a[prop] < b[prop]);
  }

  setPropToObject(obj, prop, value) {
    if (obj.hasOwnProperty(prop)) {
      obj[prop] = value;
    }
    return obj;
  }

  toggleAction = (city, prop) => {
    const { data } = this.state;
    let newArr = data.map((item) => {
      //item[prop] - returns false because of item.isWanted = false
      if (item.capital === city && item.hasOwnProperty(prop)) {
        let status = item[prop];
        item = { ...item, [prop]: !status};
      }
      return item;
    });

    this.setState({
      data: newArr
    });

    if (window.localStorage) {
      localStorage.setItem('cities', JSON.stringify(newArr));
    }
  };

  handleAdd = (cityName) => {
    let newCity = cityName.toLowerCase();
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

    // close dialog window
    this.setState({isDialogOpened: false});
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
          'isWanted': false,
          'custom': true
        };

        if (window.localStorage) {
          this.setNewObjToStorage(newItem);
        }

        currentData.push(newItem);
        currentData = this.sortAscByProp(currentData, 'temp');
        //setting theLowest and theHighest to false
        currentData.map((item) => {
          this.setPropToObject(item, 'isTheLowest', false);
          this.setPropToObject(item, 'isTheHighest', false);
          return item;
        });

        this.setPropToObject(currentData[0], 'isTheLowest', true);
        this.setPropToObject(currentData[currentData.length - 1], 'isTheHighest', true);

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
    const { defaultData } = this.state;
    if (window.localStorage) {
      let capitalsFromStorage = this.getCitiesFromLocalStorage();
      if (capitalsFromStorage) {
        window.localStorage.clear();
      }
    }

    this.setState({
      data: defaultData
    });
  };

  getApiKey() {
    return this.API_KEY;
  }

  getFullLink(capital) {
    let apiKey = this.getApiKey();
    return `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${apiKey}`;
  }

  setNewObjToStorage(newCityObj) {
    let oldValues = JSON.parse(localStorage.getItem('cities'));
    oldValues.push(newCityObj);
    let newValues = oldValues.slice(0); //copy an array;
    if (window.localStorage) {
      localStorage.setItem('cities', JSON.stringify(newValues));
    }
  }

  getCitiesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cities'));
  }

  handleOpenDialog = () => {
    this.setState({ isDialogOpened: true });
  };

  handleCloseDialog = () => {
    this.setState({ isDialogOpened: false });
  };

  removeItem = (capital) => {
    const { data } = this.state;
    let newData = data.filter((item) => item.capital !== capital);

    //sort and set the lowest and the highest temperature
    if (newData.length > 0) {
      newData = this.sortAscByProp(newData, 'temp');
      this.setPropToObject(newData[0], 'isTheLowest', true);
      this.setPropToObject(newData[newData.length - 1], 'isTheHighest', true);

      if (window.localStorage) {
        localStorage.removeItem('cities');
        localStorage.setItem('cities', JSON.stringify(newData));
      }

      this.setState({
        data: newData
      });
    } else {
      if (window.localStorage) {
        localStorage.removeItem('cities');
      }
      this.setState({
        data: []
      });
    }
  };

  handleChange = (e) => {
    let filter = e.target.value;
    let data = this.state.defaultData;
    let newArr = data.filter((item) => item.capital.indexOf(filter) !== -1);

    if (newArr.length) {
      newArr.map((item) => {
        item.isTheHighest = item.isTheHighest ? false : item.isTheHighest;
        item.isTheHighest = item.isTheLowest ? false : item.isTheLowest;
        return item;
      });
      newArr = this.sortAscByProp(newArr, 'temp');
      this.setPropToObject(newArr[0], 'isTheLowest', true);
      this.setPropToObject(newArr[newArr.length - 1], 'isTheHighest', true);
    }

    this.setState({
      data: newArr
    });
  };

  sortBy = (param = 'temp') => {
    const { data, sortName } = this.state;
    let newArr = [];
    let sortParam = param;

    if (sortParam === sortName) {
      newArr = this.sortAscByProp(data, param);
    } else {
      newArr = this.sortDescByProp(data, param);
    }

    // if (param === 'capital' || param === 'temp') {
    //   newArr = this.sortAscByProp(data, param);
    // } else {
    //   newArr = this.sortDescByProp(data, param);
    // }

    this.setState({
      data: newArr,
      sortName: sortParam
    });

  };

  render() {
    const { data, isLoading, isDialogOpened, sortName } = this.state;
    return (
        <div>
          <input type="text" onChange={(e) => this.handleChange(e)} />
          <MainpageList data={data} sortName={sortName} sortBy={this.sortBy} isLoading={isLoading} toggleAction={this.toggleAction} removeItem={this.removeItem}/>
          <MainpageButtonGroup handleOpenDialog={this.handleOpenDialog} handleReset={this.handleReset}/>
          <FormDialog isDialogOpened={isDialogOpened} handleAdd={(e) => this.handleAdd(e)} handleClose={this.handleCloseDialog}/>
        </div>
    );
  }
}

export default Mainpage;

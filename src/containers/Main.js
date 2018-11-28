import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import axios from 'axios';
import capitals from '../utils/capitals';
import MainpageList from '../components/List';
import MainpageButtonGroup from '../components/ButtonGroup';
import FormDialog from '../components/DialogWindow';
import * as weatherActions from '../store/actions';
import * as R from 'ramda';
import '../styles/list.css';
//
// const DIRECTION = {
//   temp: R.ascend,
//   isWanted: R.descend,
//   isVisited: R.descend,
//   capital: R.ascend,
//   default: R.ascend,
// };

class Mainpage extends Component {
  API_KEY = 'f816a9bfdb5f7fdf90b24a686288b114';

  componentDidMount() {
    let userCitiesFromStorage = this.getDataFromLocalStorage('cities');
    let newCapitals = userCitiesFromStorage ? userCitiesFromStorage : capitals;
    this.getFullInfo(newCapitals);
  }

  getFullInfo(capitalsArr) {
    let resultArr = [];
    this.props.weatherActions.startFetching();

    capitalsArr.length !== 0 &&
      capitalsArr.map(item => {
        let capital = item.capital ? item.capital : item;
        let isVisited = item.isVisited ? item.isVisited : false;
        let isWanted = item.isWanted ? item.isWanted : false;
        let custom = item.custom ? item.custom : false;
        let link = this.getFullLink(capital);
        let weatherPromise = axios.get(link);
        resultArr.push({
          capital: capital.toLowerCase(),
          temp: weatherPromise,
          isTheLowest: false,
          isTheHighest: false,
          isVisited: isVisited,
          isWanted: isWanted,
          custom: custom,
        });
        return resultArr;
      });
    capitalsArr.length !== 0 &&
      Promise.all(
        resultArr.map(item => {
          return item.temp;
        }),
      )
        .then(result => {
          result.map((item, i) => {
            resultArr[i].temp = Math.round(item.data.main.temp);
            return resultArr;
          });

          resultArr = this.sortAscByProp(resultArr, 'temp');
          R.head(resultArr).isTheLowest = true;
          R.last(resultArr).isTheHighest = true;

          this.props.weatherActions.endFetchingSuccess(resultArr);

          localStorage.setItem('cities', JSON.stringify(resultArr));
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            alert('The city does not exist, please enter the correct city!');
          } else {
            alert('Something goes wrong, please try again later!');
          }
        });
  }
  sortAscByProp(obj, prop) {
    return obj.sort((a, b) => {
      if (a[prop] < b[prop]) {
        return -1;
      } else if (a[prop] >= b[prop]) {
        return 1;
      }
    });
  }

  sortDescByProp(obj, prop) {
    return obj.sort((a, b) => {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] <= b[prop]) {
        return 1;
      }
    });
  }

  setPropToObject(obj, prop, value) {
    if (obj.hasOwnProperty(prop)) {
      obj[prop] = value;
    }
    return obj;
  }

  toggleAction = (city, prop) => {
    const { data } = this.props;
    let newArr = data.map(item => {
      //item[prop] - returns false because of item.isWanted = false
      if (item.capital === city && item.hasOwnProperty(prop)) {
        let status = item[prop];
        item = { ...item, [prop]: !status };
      }
      return item;
    });

    this.props.weatherActions.toggleAction(newArr);

    localStorage.setItem('cities', JSON.stringify(newArr));
  };

  handleAdd = cityName => {
    const newCity = cityName.toLowerCase();
    let currentData = this.props.data;
    let listOfCapitals = currentData.map(item => item.capital);

    if (!newCity) {
      alert('Please, enter something!');
      return;
    }

    if (listOfCapitals.includes(newCity)) {
      alert('Capital is already in a table!');
      return;
    }

    this.handleCloseDialog();
    let link = this.getFullLink(newCity);
    let weatherPromise = axios.get(link);
    weatherPromise
      .then(result => {
        let newItem = {
          capital: newCity,
          temp: Math.round(result.data.main.temp),
          isTheLowest: false,
          isTheHighest: false,
          isVisited: false,
          isWanted: false,
          custom: true,
        };

        this.setNewObjToStorage(newItem);
        currentData.push(newItem);
        const newData = this.setArrToDefault(currentData);

        this.props.weatherActions.addCapital(newData);

      })
      .catch(error => {
        if (error.response.status === 404) {
          alert('The city does not exist, please enter the correct city!');
        } else {
          alert('Something goes wrong, please try again later!');
        }
      });
  };

  handleReset = () => {
    let capitalsFromStorage = this.getDataFromLocalStorage('cities');
    if (capitalsFromStorage) {
      localStorage.clear();
    }
    this.getFullInfo(capitals);
  };

  getApiKey = () => {
    return this.API_KEY;
  };

  getFullLink = capital => {
    let apiKey = this.getApiKey();
    return `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${apiKey}`;
  };

  setNewObjToStorage = newCityObj => {
    let oldValues = this.getDataFromLocalStorage('cities');
    oldValues.push(newCityObj);
    let newValues = oldValues.slice(0); //copy an array;
    localStorage.setItem('cities', JSON.stringify(newValues));
  };

  getDataFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name));
  }

  handleOpenDialog = () => {
    console.log(this.props);
    this.props.weatherActions.openDialogWindow();
    console.log(this.props);
  };

  handleCloseDialog = () => {
    this.props.weatherActions.closeDialogWindow();
  };

  //@todo to refactor
  removeItem = capital => {
    const { data } = this.props;
    let newData = data.filter(item => item.capital !== capital);

    //sort and set the lowest and the highest temperature
    if (newData.length > 0) {
      this.setPropToObject(R.head(newData), 'isTheLowest', true);
      this.setPropToObject(R.last(newData), 'isTheHighest', true);
      localStorage.removeItem('cities');
      localStorage.setItem('cities', JSON.stringify(newData));
      this.props.weatherActions.removeCapital(newData);
    } else {
      localStorage.removeItem('cities');
      this.props.weatherActions.removeItem([]);
    }
  };

  //@todo to refactor
  handleChange = e => {
    let filter = e.target.value;
    let data = this.props.data;
    let newArr = data.filter(item => item.capital.indexOf(filter) !== -1);

    if (newArr.length) {
      newArr.map(item => {
        item.isTheHighest = item.isTheHighest ? false : item.isTheHighest;
        item.isTheHighest = item.isTheLowest ? false : item.isTheLowest;
        return item;
      });
      newArr = this.sortAscByProp(newArr, 'temp');
      this.setPropToObject(R.head(newArr), 'isTheLowest', true);
      this.setPropToObject(R.last(newArr), 'isTheHighest', true);
    }
    this.props.weatherActions.filteredData(newArr);
  };

  sortBy = (arr, param = 'temp') => {
    const { sort } = this.props;
    const isDescOrder = param === 'default' ? false : !sort.isOrderByDesc;
    const paramName = param === 'default' ? 'temp' : param;
    const newArr = isDescOrder
      ? this.sortDescByProp(arr, paramName)
      : this.sortAscByProp(arr, paramName);

    this.props.weatherActions.sortData(newArr, {
      name: param,
      isOrderByDesc: isDescOrder,
    });
    return arr;
  };

  setArrToDefault = arr => {
    const mappedArr = arr.map(item => {
      this.setPropToObject(item, 'isVisited', false);
      this.setPropToObject(item, 'isWanted', false);
      this.setPropToObject(item, 'isTheLowest', false);
      this.setPropToObject(item, 'isTheHighest', false);
      return item;
    });
    const sortedArr = this.sortAscByProp(mappedArr, 'temp');
    R.head(sortedArr).isTheLowest = true;
    R.last(sortedArr).isTheHighest = true;

    return sortedArr;
  };

  render() {
    console.log(this.props);
    const { data, isLoading, isDialogOpened, sort } = this.props;
    return (
      <div>
        <input type="text" onChange={e => this.handleChange(e)} />
        <MainpageList
          data={data}
          sortName={sort.name}
          isOrderByDesc={sort.isOrderByDesc}
          sortBy={this.sortBy}
          isLoading={isLoading}
          toggleAction={this.toggleAction}
          removeItem={this.removeItem}
        />
        <MainpageButtonGroup
          handleOpenDialog={this.handleOpenDialog}
          handleReset={this.handleReset}
        />
        <FormDialog
          isDialogOpened={isDialogOpened}
          handleAdd={e => this.handleAdd(e)}
          handleClose={this.handleCloseDialog}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    isLoading: state.isLoading,
    isDialogOpened: state.isDialogOpened,
    sort: state.sort
  }
}

function mapDispatchToProps(dispatch) {
  return {
    weatherActions: bindActionCreators(weatherActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mainpage);

import React, { Component } from 'react';
import capitals from '../utils/capitals';
import Item from '../components/ListItem';

class MainpageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      objectsWithTemp: [],
      isLoading: false,
    };

    // this.handleTemp = this.handleTemp.bind(this);
  }

  componentDidMount() {
    // units=metric - Celcium
    // units=imperial - Fahrenheit
    const API_KEY = 'f816a9bfdb5f7fdf90b24a686288b114';

    this.setState({
      isLoading: true,
    });

    capitals.map(item => {
      let capital = item.capital;
      let link = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${API_KEY}`;
      let myPromise = this.getTempByCapital(link);

      myPromise.then(result => {
        this.setState({
          objectsWithTemp: [
            ...this.state.objectsWithTemp,
            {
              code: item.code,
              capital: capital,
              temp: result,
            },
          ],
          isLoading: false,
        });
      });
    });

    // this.setState({
    //   objectsWithTemp: resultArr,
    //   isLoading: false
    // });

    /// working here ! ///
    // capitals.map((item) => {
    //   let capital = item.capital;
    //   let link = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${API_KEY}`;
    //   fetch(link)
    //       .then((result) => result.json())
    //       .then(data => {
    //         promisesArr.push({
    //           'capital': capital,
    //           'temp': data.main.temp
    //         });
    //         this.setState({
    //           tempObj: promisesArr
    //         })
    //       });
    //   });
  }

  // handleTemp(weather) {
  //   let tempObject = JSON.parse(weather).main;
  //   return tempObject && tempObject.temp;
  // }

  getTempByCapital(link) {
    let myPromise = new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status < 300) {
          let weather = JSON.parse(xhr.responseText).main;
          resolve(weather.temp);
        }
      };
      xhr.open('GET', link, true); //to make async - false
      xhr.send();
    });

    return myPromise;
  }

  render() {
    const { objectsWithTemp, isLoading } = this.state;
    console.log(objectsWithTemp);
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {objectsWithTemp.map((item, i) => {
          return (
            <div>
              <Item key={i} capital={item.capital} weather={item.temp} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default HomepageList;

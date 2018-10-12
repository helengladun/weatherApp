import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FilterList from '@material-ui/icons/FilterList';
import * as ScrollMagic from 'scrollmagic';
import Item from './Item';

class MainpageList extends Component {
  // componentDidMount() {
  //   var controller = new ScrollMagic.Controller();
  //   var scene = new ScrollMagic.Scene({
  //     triggerElement: '.list'
  //   })
  //       .setClassToggle('.list', 'fade-in')
  //       .addTo(controller);
  // }

  render() {
    const {isLoading, data, toggleAction, removeItem, sortBy, sortName} = this.props;

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (data.length === 0) {
      return <div> No elements here</div>;
    }

    return (
        <Table className="list">
          <TableHead className="list__header">
            <TableRow>
              <TableCell>Want to visit
                <FilterList onClick={() => sortBy('isWanted')} className={`filter-icon ${sortName === 'isWanted'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Visited
                <FilterList onClick={() => sortBy('isVisited')} className={`filter-icon ${sortName === 'isVisited'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Capital
                <FilterList onClick={() => sortBy('capital')} className={`filter-icon ${sortName === 'capital'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Temperature, C
                <FilterList onClick={() => sortBy('temp')} className={`filter-icon ${sortName === 'temp'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Sort to default
                <FilterList onClick={() => sortBy()} className={`filter-icon ${sortName === 'temp'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length && data.map((item, i) => {
              return (
                <Item key={i}
                  capital={item.capital}
                  weather={item.temp}
                  isTheLowest={item.isTheLowest}
                  isTheHighest={item.isTheHighest}
                  toggleAction={toggleAction}
                  isVisited={item.isVisited}
                  isWantedToVisit={item.isWanted}
                  removeItem={removeItem}
                />);
            })}
          </TableBody>
        </Table>
    );
  }
}

export default MainpageList;

import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FilterList from '@material-ui/icons/FilterList';
import Item from './ListItem';

class MainpageList extends Component {
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
                <FilterList onClick={() => sortBy(data, 'isWanted')} className={`filter-icon ${sortName === 'isWanted'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Visited
                <FilterList onClick={() => sortBy(data, 'isVisited')} className={`filter-icon ${sortName === 'isVisited'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Capital
                <FilterList onClick={() => sortBy(data, 'capital')} className={`filter-icon ${sortName === 'capital'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Temperature, C
                <FilterList onClick={() => sortBy(data)} className={`filter-icon ${sortName === 'temp'? 'filter-icon--fired' : ''}`}/>
              </TableCell>
              <TableCell>Sort to default
                <FilterList onClick={() => sortBy(data)} className={`filter-icon ${sortName === 'temp'? 'filter-icon--fired' : ''}`}/>
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

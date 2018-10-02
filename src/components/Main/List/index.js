import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Item from './Item';

const MainpageList = ({isLoading, data, toggleAction}) => {
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
      <Table className="list">
        <TableHead className="list__header">
          <TableRow>
            <TableCell>Want to visit</TableCell>
            <TableCell>Visited</TableCell>
            <TableCell>Capital</TableCell>
            <TableCell>Temperature, C</TableCell>
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
              />);
          })}
        </TableBody>
      </Table>
  );
};

export default MainpageList;

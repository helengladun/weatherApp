import React from 'react';
import LocationOn from '@material-ui/icons/LocationOn';
import Star from '@material-ui/icons/Star';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

// @todo add styles by components

const MainpageListItem = ({capital, weather, isTheLowest, isTheHighest, isVisited, isWantedToVisit, toggleAction}) => {
  return (
      <TableRow className={`list__item ${isTheLowest ? 'list__item--lowest' : ''} ${isTheHighest ? 'list__item--highest' : ''}`}>
        <TableCell><LocationOn className={`wish-icon ${isWantedToVisit? 'wish-icon--green' : ''}`} onClick={() => toggleAction(capital, 'isWanted')} color="action"/></TableCell>
        <TableCell><Star className={`visited-icon ${isVisited ? 'visited-icon--orange' : ''}`} color="action" onClick={() => toggleAction(capital, 'isVisited')}/></TableCell>
        <TableCell><div className="list__value">{capital}</div></TableCell>
        <TableCell><div className="list__value">{weather}</div></TableCell>
      </TableRow>
  );
};

export default MainpageListItem;

import React from 'react';
import LocationOn from '@material-ui/icons/LocationOn';
import Star from '@material-ui/icons/Star';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

// const yell = (Component) => {
//   return (
//       ({children, ...props}) => {
//         return  <Component {...props}>{children}</Component>
//       }
//   )
// };
// const Title = (props) => <h1>{props.children}</h1>;
// const AngryTitle = yell(Title);

const MainpageListItem = ({capital, weather, isTheLowest, isTheHighest, isVisited, isWantedToVisit, toggleAction, removeItem}) => {
  return (
      <TableRow className={`list__item
        ${isTheLowest ? 'list__item--lowest' : ''}
        ${isTheHighest ? 'list__item--highest' : ''}
        ${isVisited ? 'list__item--visited' : ''}
        ${isWantedToVisit ? 'list__item--wanted' : ''}`}
      >
        <TableCell><LocationOn className={`wish-icon ${isWantedToVisit? 'wish-icon--green' : ''}`} onClick={() => toggleAction(capital, 'isWanted')} color="action"/></TableCell>
        <TableCell><Star className={`visited-icon ${isVisited ? 'visited-icon--orange' : ''}`} color="action" onClick={() => toggleAction(capital, 'isVisited')}/></TableCell>
        <TableCell><div className="list__value">{capital}</div></TableCell>
        <TableCell><div className="list__value" onClick={() => console.log(this)}>{weather}</div></TableCell>
        <TableCell><div onClick={() => removeItem(capital)} className="btn__remove">Remove</div></TableCell>
      </TableRow>
  );
};

export default MainpageListItem;

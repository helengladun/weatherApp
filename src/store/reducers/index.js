import {
  FETCH_CAPITALS_BEGIN,
  FETCH_CAPITALS_SUCCESS,
  FETCH_CAPITALS_FAILURE,
  ADD_CAPITAL,
  REMOVE_CAPITAL,
  TOGGLE_ACTION,
  SORT_BY,
  FILTERED,
  OPEN_DIALOG_WINDOW,
  CLOSE_DIALOG_WINDOW
} from '../constants/List';

const initialState = {
  data: [],
  isLoading: true,
  isDialogOpened: false,
  sort: {
    name: 'temp',
    isOrderByDesc: false,
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAPITALS_BEGIN:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case FETCH_CAPITALS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        data: [...action.data]
      };
    case FETCH_CAPITALS_FAILURE:
      return {
        ...state,
        isLoading: action.isLoading
      };
    case TOGGLE_ACTION:
      return {
        ...state,
        data: [...action.data]
      };
    case ADD_CAPITAL:
      return {
        ...state,
        data: [...action.data]
      };
    case REMOVE_CAPITAL:
      return {
        ...state,
        data: [...action.data]
      };
    case OPEN_DIALOG_WINDOW:
      return {
        ...state,
        isDialogOpened: action.isDialogOpened
      };
    case CLOSE_DIALOG_WINDOW:
      return {
        ...state,
        isDialogOpened: action.isDialogOpened
      };
    case FILTERED:
      return {
        ...state,
        data: action.data
      };
    case SORT_BY:
      return {
        ...state,
        data: action.data,
        sort: action.sort
      };
    default:
      return state;
  }
};

export default reducer;

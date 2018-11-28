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
  CLOSE_DIALOG_WINDOW,
} from '../constants/List';

export const startFetching = () => ({
  type: FETCH_CAPITALS_BEGIN,
  isLoading: true
});

export const endFetchingSuccess = (data) => ({
  type: FETCH_CAPITALS_SUCCESS,
  isLoading: false,
  data: data
});

export const endFetchingFailure = () => ({
  type: FETCH_CAPITALS_FAILURE,
  isLoading: true,
});

export const toggleAction = (data) => ({
  type: TOGGLE_ACTION,
  data: data
});

export const openDialogWindow = () => ({
  type: OPEN_DIALOG_WINDOW,
  isDialogOpened: true
});

export const closeDialogWindow = () => ({
  type: CLOSE_DIALOG_WINDOW,
  isDialogOpened: false
});

export const addCapital = (data) => ({
  type: ADD_CAPITAL,
  data: data
});

export const removeCapital = (data) => ({
  type: REMOVE_CAPITAL,
  data: data
});

export const filteredData = (data) => ({
  type: FILTERED,
  data: data
});

export const sortData = (data, sort) => ({
  type: SORT_BY,
  data: data,
  sort: sort
});

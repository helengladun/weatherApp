import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class FormDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cityName: '',
    };
  }

  changeText = e => {
    this.setState({ cityName: e.target.value });
  };

  render() {
    console.log(this.props);
    const { isDialogOpened, handleClose, handleAdd } = this.props;
    const { cityName } = this.state;

    return (
      <div>
        <Dialog open={isDialogOpened} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add city</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type="text"
              fullWidth
              onChange={this.changeText}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleAdd(cityName)} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default FormDialog;

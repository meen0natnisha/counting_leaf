import * as React from 'react';
import { Modal, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function Alert(props) {
    let { mode, handleClose, handleOpen, open, content } = props

    const RenderAlert = (mode) => {
        switch (mode) {
            case 'delete':
                return (
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Delete
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this item?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Disagree</Button>
                            <Button onClick={handleClose} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
            default:
                return (
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <img src={content} width="400" />
                        </Box>
                    </Modal>
                )
        }
    }

    return <div>
        {
            RenderAlert(mode)
        }
    </div>
}

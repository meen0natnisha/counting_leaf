import * as React from "react";
import {
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ImageList,
  ImageListItem,
  IconButton,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { EmptyImg } from "../assets";
import { useEffect } from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Alert(props) {
  let { mode, handleClose, handleOpen, open, content } = props;
  const [preview, setPreview] = useState();

  useEffect(() => {
    setPreview(content);
  }, [content]);

  const ImageArrayList = (imageSet) => {
    return (
      <div className="center">
        <div className="Image-array-list" color="white">
          <ImageList
            sx={{ width: 350, height: 50 }}
            cols={5}
            rowHeight={50}
            color={"primary"}
            style={{ display: `${imageSet.length !== 0 ? "grid" : "none"}` }}
          >
            {imageSet.map((item, index) => (
              <IconButton
                key={index}
                onClick={() =>
                  setPreview({
                    title: item.title,
                    img: item.img,
                    selected: true,
                  })
                }
              >
                <ImageListItem>
                  <img
                    src={item.img}
                    srcSet={item.img}
                    alt={item.title}
                    loading="lazy"
                    width="50"
                  />
                </ImageListItem>
              </IconButton>
            ))}
          </ImageList>
        </div>
      </div>
    );
  };

  const RenderAlert = (mode) => {
    switch (mode) {
      case "delete":
        return (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
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
        );
      case "imageList":
        return (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {preview ? (
              <Grid className="center">
                {preview.selected ? (
                  <img
                    src={preview.img}
                    alt={preview.title}
                    width="640px"
                    height="640px"
                    className="center"
                  />
                ) : (
                  <img
                    src={EmptyImg}
                    alt="upload img"
                    loading="lazy"
                    width="640px"
                    height="640px"
                    className="center"
                  />
                )}
                {ImageArrayList(content)}
              </Grid>
            ) : (
              <img
                src={EmptyImg}
                alt="upload img"
                loading="lazy"
                width="640px"
                height="640px"
                className="center"
              />
            )}
          </Modal>
        );
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
        );
    }
  };

  return <div>{RenderAlert(mode)}</div>;
}

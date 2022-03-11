import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Grid,
  TextField,
  Stack,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import { styled } from "@mui/material/styles";
import DateAdapter from "@mui/lab/AdapterMoment";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ParkIcon from "@mui/icons-material/Park";
import SpaIcon from "@mui/icons-material/Spa";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { makeStyles } from "@mui/styles";

import { EmptyImg } from "../assets";
import { Board, MyButton } from "../components";

import Resizer from "react-image-file-resizer";
import swal from "sweetalert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import runModel from "../service/detect";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#000",
    WebkitFontSmoothing: "auto",
    letterSpacing: "normal",
    "& .MuiDataGrid-root": {
      border: 0,
    },
    "& .MuiButton-contained": {
      borderRadius: "20px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
    },
  },
}));

const Input = styled("input")({
  display: "none",
});

function createData(id, name, code) {
  return { id: id, title: name, action: code };
}

export default function CreateTree() {
  const classes = useStyles();
  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState();
  const [date, setDate] = React.useState(new Date());
  const [data, setData] = useState([]);
  const [treeName, settreeName] = useState("");
  const [leaf, setleaf] = useState();
  const [note, setnote] = useState("");
  let navigate = useNavigate();
  const [loading, setloading] = useState({
    status: false,
    curState: 0,
    maxState: 0,
  });
  //   const [dataGrid, setDataGrid] = useState([]);

  const columns = [
    {
      field: "title",
      headerName: "Name",
      minWidth: 200,
      headerClassName: "Table_theme--header __left",
      flex: 1,
    },
    {
      field: "action",
      headerName: "",
      minWidth: 80,
      renderCell: (params) => (
        <IconButton onClick={() => console.log(params.value)}>
          <DeleteForeverIcon color="primary" />
        </IconButton>
      ),
      headerClassName: "Table_theme--header __right",
    },
  ];

  // useEffect(() => {
  //   data.forEach((child) => console.log(child));
  // }, [data]);

  const handleUpload = async (event) => {
    let blob = event.target.files[0];
    const image64 = await resizeFile(blob);
    let imageList = image;
    imageList.push({
      title: blob.name,
      img: image64,
    });
    setImage(imageList);
    setData(data.concat(createData(blob.name, blob.name, blob.name)));
    setPreview({ title: blob.name, img: image64 });
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        640,
        640,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const ImageArrayList = (imageSet) => {
    return (
      <div className="Image-array-list">
        <ImageList
          sx={{ width: 350, height: 50 }}
          cols={5}
          rowHeight={50}
          style={{ display: `${image.length !== 0 ? "grid" : "none"}` }}
        >
          {imageSet.map((item, index) => (
            <IconButton
              key={index}
              onClick={() => setPreview({ title: item.title, img: item.img })}
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
        <label htmlFor="icon-button-file">
          <Input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={(event) => handleUpload(event)}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <AddBoxOutlinedIcon />
          </IconButton>
        </label>
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (treeName === "") return swal("Please enter a tree name");
    else if (leaf === "") return swal("Please enter a leaf");
    else if (isNaN(leaf)) return swal("Please enter leaf as a valid number");
    const userId = localStorage.getItem("accessTokenLeafCount");
    const data = (
      await axios.post("/tree", {
        name: treeName,
        leaf: leaf,
        date: date,
        imgList: image,
        note: note,
        userId,
        action: "addTree",
      })
    ).data;
    if ("success" in data) {
      swal("Success", data.success, "success", {
        buttons: false,
        timer: 2000,
      }).then(() => {
        navigate(`/dashboard`);
      });
    } else {
      swal("Failed", data.failed, "error");
    }
  };

  const detectImg = async () => {
    if (image.length) {
      let leafCount = 0;
      let count = 1
      for await (const img of image) {
        setloading({
          status: true,
          curState: count,
          maxState: image.length,
        })
        leafCount += await runModel(img.img);
        count++
      }
      setleaf(Math.ceil(leafCount / image.length));
      setloading({status:false})
    } else setleaf(0);
  };

  return (
    <div className={`Paper ${classes.root}`}>
      <h4>Add Tree</h4>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12} style={{ marginLeft: "-1em" }}>
          {image.length !== 0 && preview ? (
            <img src={preview.img} alt={preview.title} width="70%" />
          ) : (
            <img src={EmptyImg} alt="upload img" loading="lazy" width="100%" />
          )}
          {ImageArrayList(image)}
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack spacing={2}>
            <strong>Record Detail</strong>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                label="Date"
                value={date}
                inputFormat="DD/MM/YYYY"
                onChange={(newValue) => {
                  setDate(moment(newValue).toDate());
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-basic"
              label="Tree Name"
              variant="outlined"
              InputProps={{
                startAdornment: <ParkIcon color="primary" />,
              }}
              onChange={(e) => settreeName(e.target.value)}
            />
            <Stack spacing={2}>
              <strong>Tree Information</strong>
              <TextField
                id="outlined-basic"
                label="Leaf"
                variant="outlined"
                value={leaf}
                InputProps={{
                  startAdornment: (
                    <SpaIcon
                      color="primary"
                      onClick={() => detectImg()}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                }}
                onChange={(e) => setleaf(e.target.value)}
              />
              {loading.status ? (
                <strong>
                  Loading...{loading.curState}/{loading.maxState}
                </strong>
              ) : (
                ""
              )}
            </Stack>
            <Stack spacing={2}>
              <TextField
                id="outlined-basic"
                label="Note"
                variant="outlined"
                InputProps={{
                  startAdornment: <NoteAltIcon color="primary" />,
                }}
                onChange={(e) => setnote(e.target.value)}
              />
            </Stack>
            {/* <Board height={300} data={dataGrid} columns={columns} /> */}

            <MyButton onClick={handleSubmit}>Submit</MyButton>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

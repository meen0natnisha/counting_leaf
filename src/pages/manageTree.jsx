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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import Resizer from "react-image-file-resizer";
import runModel from "../service/detect";

const Input = styled("input")({
  display: "none",
});

function createData(id, name, code) {
  return { id: id, title: name, action: code };
}

export default function ManageTree() {
  let location = useLocation();
  let param = useParams();
  let { name, exportedData } = location.state;
  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState();
  const [date, setDate] = React.useState(new Date());
  const [data, setData] = useState([]);
  const [leaf, setleaf] = useState();
  const [note, setnote] = useState("");
  const [recordId, setrecordId] = useState("");
  const [treeName, settreeName] = useState("");
  const [loading, setloading] = useState({
    status: false,
    curState: 0,
    maxState: 0,
  });
  let navigate = useNavigate();

  useEffect(() => {
    if (exportedData) {
      settreeName(name);
      for (const data of Object.entries(exportedData)) {
        const [key, value] = data;
        switch (key) {
          case "record_date":
            setDate(moment(value).toDate());
            break;
          case "leaf":

            setleaf(value.toString());
            break;
          case "preview":
            setImage(value);
            break;
          case "note":
            setnote(value);
            break;
          case "recordId":
            setrecordId(value);
            break;
          default:
            break;
        }
      }
    } else settreeName(location.state);
  }, []);

  const columns = [
    {
      field: "title",
      headerName: "Name",
      minWidth: 200,
      headerClassName: "Table_theme--header __left",
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

  const handleAddRecord = async () => {
    if (leaf === "") return swal("Please enter a leaf");
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
        action: "addRecord",
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

  const handleSaveRecord = async () => {
    if (leaf === "") return swal("Please enter a leaf");
    else if (isNaN(leaf)) return swal("Please enter leaf as a valid number");
    const userId = localStorage.getItem("accessTokenLeafCount");
    const data = (
      await axios.patch(`/record?id=${recordId}`, {
        name: treeName,
        leaf: leaf,
        date: date,
        imgList: image,
        note: note,
        userId,
        action: "saveRecord",
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

  const handleDeleteRecord = async () => {
    const data = (
      await axios.delete(`/tree?id=${recordId}`).catch((err) => {
        console.log(err);
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
    <div className={`Paper`}>
      <h4>{treeName}</h4>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12} style={{ marginLeft: "-1em" }}>
          {image.length !== 0 && preview ? (
            <img src={preview.img} alt={preview.title} width="100%" />
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={params?.inputProps?.placeholder}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-basic"
              label="Tree Name"
              variant="outlined"
              value={treeName}
              disabled={true}
              InputProps={{
                startAdornment: <ParkIcon color="primary" />,
              }}
            />
            <Stack spacing={3}>
              <strong>Tree Information</strong>
              <TextField
                id="outlined-basic"
                label="Leaf"
                variant="outlined"
                value={leaf}
                onChange={(e) => setleaf(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SpaIcon
                      color="primary"
                      onClick={() => detectImg()}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                }}
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
                value={note}
                InputProps={{
                  startAdornment: <NoteAltIcon color="primary" />,
                }}
                onChange={(e) => setnote(e.target.value)}
              />
            </Stack>
            {/* <Board height={300} data={dataGrid} columns={columns} /> */}

            {param.manage === "add_record" ? (
              <MyButton onClick={handleAddRecord}>Submit</MyButton>
            ) : (
              <Stack spacing={2}>
                <MyButton onClick={handleSaveRecord}>Save</MyButton>
                <MyButton color="light" onClick={handleDeleteRecord}>
                  delete
                </MyButton>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

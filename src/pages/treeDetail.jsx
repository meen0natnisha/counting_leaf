import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Input,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { Board, Alert, MyButton } from "../components";
import { EmptyImg } from "../assets";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";

function createData(id, name, leaf, img, recId, note) {
  return { id: id, record_date: name, leaf: leaf, preview: img, recordId: recId, note };
}

export default function TreeDetail() {
  let navigate = useNavigate();
  const location = useLocation();
  const [preview, setPreview] = useState();
  const [recordDate, setRecordDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState("");
  const [dataSet, setDataSet] = useState([]);
  const handleOpen = (value) => (setOpen(true), setPreview(value));
  const handleClose = () => setOpen(false);


  //   const data = [
  //     createData(0, recordDate, 1200, EmptyImg),
  //     createData(1, recordDate, 1000, EmptyImg),
  //     createData(2, recordDate, 300, EmptyImg),
  //     createData(3, recordDate, 1000, EmptyImg),
  //     createData(4, recordDate, 200, EmptyImg),
  //     createData(5, recordDate, 2000, EmptyImg),
  //   ];

  useEffect(async () => {
    const uid = localStorage.getItem("accessTokenLeafCount");
    const data = (
      await axios.get(`/tree/detail?treeName=${location.state}&userId=${uid}`)
    ).data;
    const dataList = [];
    let count = 0;
    for await (const record of data) {
      dataList.push(
        createData(count++, moment(record.date).toDate(), parseInt(record.leaf), record.imgList, record.id, record.note)
      );
    }
    setDataSet(dataList);
  }, []);

  const handleDeleteRecord = async (recordId) => {
    const data = (
      await axios.delete(`/record?id=${recordId}`).catch(err => {
        console.log(err);
      })
    ).data;
    if ("success" in data) {
      swal("Success", data.success, "success", {
        buttons: false,
        timer: 2000,
      }).then(() => {
        window.location.reload(false);
      });
    } else {
      swal("Failed", data.failed, "error");
    }
  };

  const columns = [
    {
      field: "record_date",
      headerName: "Record Date",
      minWidth: 300,
      headerClassName: "super-app-theme--header__left",
      flex: 1,
    },
    {
      field: "leaf",
      headerName: "Leaf",
      minWidth: 300,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "note",
      headerName: "Note",
      minWidth: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <MyButton
          color="light"
          onClick={() => (swal("Note", params.row.note === "" ? "Nothing is noted." : params.row.note, "info"))}
        >
          <ImageOutlinedIcon /> Note
        </MyButton>
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      minWidth: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <MyButton
          color="light"
          onClick={() => (setShow("preview"), handleOpen(params.value))}
        >
          <ImageOutlinedIcon /> Preview
        </MyButton>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      minWidth: 80,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          onClick={() =>{
            navigate(`/manage-tree/edit_record`, { state: {name: location.state, exportedData: params.row} })
          }
          }
        >
          <EditOutlinedIcon color="primary" />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 80,
      headerClassName: "super-app-theme--header__right",
      renderCell: (params) => (
        <IconButton
          onClick={() => (handleDeleteRecord(params.row.recordId))}
        >
          <DeleteForeverOutlinedIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <div className={`Paper`}>
        <div className="Paper-header">
          <span>{location.state}</span>
        </div>

        <Board searchBar={true} data={dataSet} columns={columns} height={500} />
        {show === "preview" ? (
          <Alert
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            mode={"imageList"}
            content={preview}
          />
        ) : (
          <Alert
            mode={"imageList"}
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            content={preview}
          />
        )}
      </div>
    </>
  );
}

import * as React from "react";
import { Button, IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Board, MyButton } from "../components";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

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
  },
  fillwindow: {
    height: "100%",
    position: "absolute",
    left: "0",
    width: "100%",
    overflow: "hidden",
  },
}));

function createData(id, name) {
  return { id: id, name: name, action: name, info: name };
}

const data = [
  createData(0, "Oak-1-1"),
  createData(1, "China"),
  createData(2, "Italy"),
  createData(3, "United States"),
  createData(4, "Canada"),
  createData(5, "Australia"),
];

export default function Dashboard() {
  const classes = useStyles();
  const [dataSet, setDataSet] = useState([]);
  let navigate = useNavigate();

  useEffect(async () => {
    const uid = localStorage.getItem("accessTokenLeafCount");
    const data = (await axios.get(`/tree?userId=${uid}`)).data;
    const dataList = [];
    let count = 0;
    for await (const tree of data) {
      dataList.push(createData(count++, tree.name));
    }
    setDataSet(dataList);
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 900,
      headerClassName: "super-app-theme--header__left",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Add Record",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(`/manage-tree/add_record`, { state: params.value })
          }
        >
          <AddBoxIcon color="primary" />
        </IconButton>
      ),
    },
    {
      field: "info",
      headerName: "Info",
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate("/tree-detail", { state: params.value })}
        >
          <InfoOutlinedIcon color="primary" />
        </IconButton>
      ),
      headerClassName: "super-app-theme--header__right",
    },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("accessTokenLeafCount");
    navigate({ pathname: "/" });
  };

  return (
    <>
      <div className={`Paper ${classes.root}`}>
        <div className="Paper-header">
          <span>Tree List</span>
          <MyButton onClick={() => navigate({ pathname: "/create-tree" })}>
            + Add Tree
          </MyButton>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={handleLogOut}
          >
            Log out
          </Button>
        </div>

        <Board
          className="fillwindow"
          height={500}
          searchBar={true}
          data={dataSet}
          columns={columns}
        />
      </div>
    </>
  );
}

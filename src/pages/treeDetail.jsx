import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from "react-router-dom";
import { Board, Alert, MyButton } from '../components';
import { EmptyImg } from '../assets';


function createData(id, name, leaf, img) {
    return { 'id': id, 'record_date': name, 'leaf': leaf, 'preview': img };
}

export default function TreeDetail() {
    let navigate = useNavigate();
    const location = useLocation();
    const [preview, setPreview] = useState();
    const [recordDate, setRecordDate] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = useState('');
    const handleOpen = (value) => (setOpen(true), setPreview(value));
    const handleClose = () => setOpen(false);


    const data = [
        createData(0, recordDate, 1200, EmptyImg),
        createData(1, recordDate, 1000, EmptyImg),
        createData(2, recordDate, 300, EmptyImg),
        createData(3, recordDate, 1000, EmptyImg),
        createData(4, recordDate, 200, EmptyImg),
        createData(5, recordDate, 2000, EmptyImg),
    ];

    const columns = [
        { field: 'record_date', headerName: 'Record Date', minWidth: 300, headerClassName: 'super-app-theme--header__left' },
        { field: 'leaf', headerName: 'Leaf', minWidth: 400, headerClassName: 'super-app-theme--header', },
        {
            field: 'preview',
            headerName: 'Preview',
            minWidth: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <MyButton color='light' onClick={() => (setShow('preview'), handleOpen(params.value))}>
                    <ImageOutlinedIcon /> Preview
                </MyButton>
            ),
        },
        {
            field: 'edit',
            headerName: 'Edit',
            minWidth: 80,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <IconButton onClick={() => navigate(
                    `/manage-tree/edit_record`,
                    { state: location.state }
                )}>
                    <EditOutlinedIcon color='primary' />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            minWidth: 80,
            headerClassName: 'super-app-theme--header__right',
            renderCell: (params) => (
                <IconButton onClick={() => (setShow('delete'), handleOpen(params.value))}>
                    <DeleteForeverOutlinedIcon color='primary' />
                </IconButton>
            ),
        },
    ];

    return <>
        <div className={`Paper`}>
            <div className='Paper-header'>
                <span>{location.state}</span>
            </div>

            <Board
                searchBar={true}
                data={data}
                columns={columns}
                height={500}
            />
            {
                show === 'preview'
                    ? <Alert open={open} handleOpen={handleOpen} handleClose={handleClose} content={preview} />
                    : <Alert mode={show} open={open} handleOpen={handleOpen} handleClose={handleClose} content={preview} />
            }
        </div>
    </>;
}

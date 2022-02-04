import * as React from 'react';
import { Button, IconButton } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";
import { Board, MyButton } from '../components';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            color: '#000',
            WebkitFontSmoothing: 'auto',
            letterSpacing: 'normal',
            '& .MuiDataGrid-root': {
                border: 0,
            },
            '& .MuiButton-contained': {
                borderRadius: '20px'
            },

        },
    }),
);

function createData(id, name) {
    return { 'id': id, 'name': name, 'action': name, 'info': name };
}

const data = [
    createData(0, 'Oak-1-1'),
    createData(1, 'China',),
    createData(2, 'Italy',),
    createData(3, 'United States',),
    createData(4, 'Canada',),
    createData(5, 'Australia',),
];

export default function Dashboard() {
    const classes = useStyles();
    let navigate = useNavigate();
    const columns = [
        { field: 'name', headerName: 'Name', width: 700, headerClassName: 'super-app-theme--header__left' },
        {
            field: 'action',
            headerName: 'Add Record',
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <IconButton onClick={() => navigate(
                    `/manage-tree/add_record`,
                    { state: params.value }
                )}>
                    <AddBoxIcon color='primary' />
                </IconButton>
            ),
        },
        {
            field: 'info',
            headerName: 'Info',
            renderCell: (params) => (
                <IconButton onClick={() => navigate(
                    '/tree-detail',
                    { state: params.value }
                )}>
                    <InfoOutlinedIcon color='primary' />
                </IconButton>
            ),
            headerClassName: 'super-app-theme--header__right'
        },
    ];

    return <>
        <div className={`Paper ${classes.root}`}>
            <div className='Paper-header'>
                <span>Tree List</span>
                <MyButton onClick={() => navigate({ pathname: '/create-tree' })}>+ Add Tree</MyButton>
            </div>

            <Board
                height={500}
                searchBar={true}
                data={data}
                columns={columns} />

        </div>
    </>;
}


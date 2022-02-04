import React, { useEffect, useState } from 'react';
import { Button, IconButton, ImageList, ImageListItem, Grid, TextField, Stack } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import { styled } from '@mui/material/styles';
import DateAdapter from '@mui/lab/AdapterMoment';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ParkIcon from '@mui/icons-material/Park';
import SpaIcon from '@mui/icons-material/Spa';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { makeStyles } from '@mui/styles';

import { EmptyImg } from '../assets'
import { Board, MyButton } from '../components';
import { useLocation, useParams } from 'react-router-dom';

const Input = styled('input')({
    display: 'none',
});

function createData(id, name, code) {
    return { 'id': id, 'title': name, 'action': code };
}

export default function ManageTree() {
    let location = useLocation()
    let param = useParams()
    const [image, setImage] = useState([])
    const [preview, setPreview] = useState()
    const [value, setValue] = React.useState(new Date());
    const [data, setData] = useState([]);
    const [dataGrid, setDataGrid] = useState([{ id: 'd', title: 'ddkddk', action: 'dkddk' }]);

    const columns = [
        { field: 'title', headerName: 'Name', minWidth: 200, headerClassName: 'Table_theme--header __left' },
        {
            field: 'action',
            headerName: '',
            minWidth: 80,
            renderCell: (params) => (
                <IconButton onClick={() => console.log(params.value)}>
                    <DeleteForeverIcon color='primary' />
                </IconButton>
            ),
            headerClassName: 'Table_theme--header __right'
        },
    ];

    useEffect(() => {
        data.forEach((child) => console.log(child))
    }, [data]);


    const handleUpload = (event) => {
        let blob = event.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            let imageSet = image
            imageSet.push({
                title: blob.name,
                img: base64data,
            })
            setImage(imageSet)
            setData(data.concat(createData(blob.name, blob.name, blob.name)))
            setPreview({ title: blob.name, img: base64data })
        }
    }

    const ImageArrayList = (imageSet) => {
        return (
            <div className='Image-array-list'>
                <ImageList sx={{ width: 350, height: 50 }} cols={5} rowHeight={50} style={{ display: `${image.length !== 0 ? 'grid' : 'none'}` }}>
                    {imageSet.map((item, index) => (
                        <IconButton key={index} onClick={() => setPreview({ title: item.title, img: item.img })}>
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
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={(event) => handleUpload(event)} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <AddBoxOutlinedIcon />
                    </IconButton>
                </label>
            </div>
        )
    }

    return <div className={`Paper`}>
        <h4>{location.state}</h4>
        <Grid container spacing={2}>
            <Grid item md={6} xs={12} style={{ marginLeft: '-1em' }}>
                {image.length !== 0 && preview
                    ? <img src={preview.img} alt={preview.title} width="100%" />
                    : <img src={EmptyImg} alt='upload img' loading="lazy" width="100%" />}
                {ImageArrayList(image)}
            </Grid>
            <Grid item md={4} xs={12}>
                <Stack spacing={2}>
                    <strong>Record Detail</strong>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DatePicker
                            label="Date"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        id="outlined-basic"
                        label="Tree Name"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <ParkIcon color='primary' />
                            ),
                        }} />
                    <Stack spacing={2}>
                        <strong>Tree Information</strong>
                        <TextField
                            id="outlined-basic"
                            label="Leaf"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <SpaIcon color='primary' />
                                ),
                            }} />
                    </Stack>
                    <Board height={300} data={dataGrid} columns={columns} />

                    {
                        param.manage === 'add_record'
                            ? <MyButton>Submit</MyButton>
                            : <Stack spacing={2}>
                                <MyButton>Save</MyButton>
                                <MyButton color='light'>delete</MyButton>
                            </Stack>
                    }
                </Stack>
            </Grid>

        </Grid>
    </div>
}

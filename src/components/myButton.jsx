import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '20px',
    padding: '0.5em 1em',
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
    },
}));

const LightButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    borderRadius: '20px',
    padding: '0.5em 1em',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
}));


export default function MyButton(props) {
    const { color, ...other } = props;

    return <>
        {
            color === 'light'
                ? <LightButton  {...other} />
                : <CustomButton {...other} />
        }
    </>
}

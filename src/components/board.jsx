import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useEffect } from 'react';
// import { makeStyles, styled } from '@mui/styles';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme()

// const useStyles = makeStyles(
//     (theme) => ({
//         root: {
//             color: '#000',
//             WebkitFontSmoothing: 'auto',
//             letterSpacing: 'normal',
//             '& .MuiDataGrid-root': {
//                 border: 0,
//             },
//             '& .MuiDataGrid-iconSeparator': {
//                 display: 'none',
//             },
//             '& .MuiDataGrid-columnHeaders': {
//                 // backgroundColor: theme.palette.primary.light,
//                 fontSize: 13,
//                 color: 'black',
//                 borderRadius: '25px',
//                 fontWeight: '300',
//                 minHeight: '50px'
//             },
//             '& .MuiPaginationItem-root': {
//                 borderRadius: 0,
//                 color: '#000',
//             },
//         },
//     }),
// );

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
    return (
        <Box
            sx={{
                p: 0.5,
                pb: 0,
            }}
        >
            <TextField
                variant="outlined"
                value={props.value}
                onChange={props.onChange}
                placeholder="Search"
                InputProps={{
                    endAdornment: (
                        <>
                            {
                                props.value ? <IconButton
                                    title="Clear"
                                    aria-label="Clear"
                                    size="small"
                                    onClick={props.clearSearch}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                                    : <IconButton
                                        title="Clear"
                                        aria-label="Clear"
                                        size="small"
                                        onClick={props.clearSearch}
                                    >
                                        <SearchIcon fontSize="small" />
                                    </IconButton>
                            }
                        </>
                    ),
                }}
                sx={{
                    width: {
                        xs: 1,
                        sm: 'auto',
                    },
                    m: (theme) => theme.spacing(1, 0.5, 1.5),
                    '& .MuiSvgIcon-root': {
                        mr: 0.5,
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '10px',
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px'
                    }
                }}
            />
        </Box>
    );
}

QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default function Board(props) {
    // const classes = useStyles();
    let { data, columns, searchBar } = props
    const [rows, setRows] = React.useState(data);
    const [searchText, setSearchText] = React.useState('');
    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = data.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setRows(filteredRows);
    };

    useEffect(() => {
        setRows(data);
    }, [data]);
    return (
        <Box
            sx={{
                height: props.height ? props.height : 500,
                width: 1,
                '& .super-app-theme--header,  .super-app-theme--header__left, .super-app-theme--header__right': {
                    bgcolor: (theme) => theme.palette.primary.light,
                    '&__left': {
                        borderTopLeftRadius: '20px',
                        borderBottomLeftRadius: '20px'
                    },
                    '&__right': {
                        borderTopRightRadius: '20px',
                        borderBottomRightRadius: '20px'
                    }
                },

            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{ Toolbar: searchBar ? QuickSearchToolbar : null }}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (event) => requestSearch(event.target.value),
                        clearSearch: () => requestSearch(''),
                    },
                }}
                sx={{
                    border: 0,
                }}
            />
        </Box>
    );
}

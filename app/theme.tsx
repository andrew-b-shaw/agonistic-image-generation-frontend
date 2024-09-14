import {createTheme} from "@mui/material/styles";
import '../GeneralSans_Complete/Fonts/WEB/css/general-sans.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const theme = createTheme({
    palette: {
        primary: {main: '#4F18A9'},
        secondary: {main: '#FFFFFF'}
    },
    typography: {
        h1: {
            fontFamily: '"GeneralSans-Light"',
            fontSize: '1.75rem',
            letterSpacing: 1
        },
        h4: {
            fontFamily: '"GeneralSans-Medium"',
            fontSize: '1.75rem',
            letterSpacing: 1
        },
        h5: {
            fontFamily: '"GeneralSans-Medium"',
            letterSpacing: 0.75
        },
        h6: {
            fontFamily: '"GeneralSans-Medium"',
            fontWeight: 400
        },
        button: {
            fontFamily: '"GeneralSans-Medium"',
            fontWeight: 400
        },
        subtitle1: {
            fontFamily: '"GeneralSans-Regular"'
        }
    }
});
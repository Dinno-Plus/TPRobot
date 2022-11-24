import { createTheme } from "@mui/material";

const spacing = 1;

export const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", "Noto Sans KR"].join(","),
  },
  spacing: spacing,
  size: { Header: { height: `${120 / 12}vh` } }, // 120
  shape: { borderRadius: spacing },
  palette: {
    primary: { main: "#5B7BF0" },
    secondary: { main: "#5C56C0" },
    text: {
      primary: "#ffffff", //white
      secondary: "#19191E", //black
      lightGrey: "#bdbdc2",
    },
    grey: {
      300: "#e0e0e5",
      350: "#ceced3",
      400: "#bdbdc2",
      500: "#9e9ea3",
      600: "#75757A",
      700: "#616166",
      750: "#515156",
      800: "#424247",
      850: "#313136",
      900: "#212126",
      950: "#101015",
    },
    gradient: {
      blue: "linear-gradient(180deg, #2979ff, #1069FF)",
      green: "linear-gradient(180deg, #00e676, #00C95C)",
      yellow: "linear-gradient(180deg, #ffc400, #E0A900)",
      purple: "linear-gradient(180deg, #651fff, #5306FF)",
      red: "linear-gradient(180deg, #FF4072, #FF265F)",

      darkBlue: "linear-gradient(180deg, #004AC5, #1069FF)",
      darkGreen: "linear-gradient(180deg, #00AD43, #00C95C)",
      darkYellow: "linear-gradient(180deg, #C18F00, #E0A900)",
      darkPurple: "linear-gradient(180deg, #0000C5, #5306FF)",
      darkRed: "linear-gradient(180deg, #BF0043, #FF265F)",
    },
    lightBlue: "#B0C0F6",
    midBlue: "#68A1FF",
    blue: "#2979ff",
    lightGreen: "#A6E6AF",
    midGreen: "#4CED9E",
    green: "#00e676",
    yellow: "#ffc400",
    lightPurple: "#C3B1F9",
    midPurple: "#9361FF",
    purple: "#651fff",
    red: "#FF4072",
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
  ],
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { fontWeight: 400, letterSpacing: 0 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", //white
          fontWeight: 500,
          letterSpacing: 0,
          textTransform: "none",
          minWidth: 0,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          borderRadius: `${12 / 12}vh`, // 12
          height: `${4 / 12}vh`, // 4
          "@media (pointer: coarse)": {
            padding: `${20 / 12}vh ${0 / 19.2}vw`, //`${20}px ${0}px`,
          },
        },
        rail: {
          height: `${8 / 12}vh`, // 8
          borderRadius: `${4 / 12}vh`, // 4
        },
        track: {
          borderWidth: `${1 / 12}vh`, // 1
          height: `${8 / 12}vh`, // 8
          borderRadius: `${4 / 12}vh`, // 4
        },
        thumb: {
          height: `${36 / 12}vh`, // 36,
          width: `${36 / 19.2}vw`, //  36,
          backgroundColor: "#E0E0E0",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: `${8 / 12}vh ${8 / 19.2}vw`,
          color: "#75757A",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: "inherit" },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
        }
        ul {
          list-style: none;
          margin: 0px;
          padding: 0px;
        }
        a {
          text-decoration: none;
        }
        ::-webkit-scrollbar {
          display: none;
        }

        /* NOTE: Roboto */
        /* roboto-100 - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 100;
          src: url('../fonts/roboto-v29-latin-100.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-100.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-100.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-100.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-100.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-100.svg#Roboto') format('svg'); /* Legacy iOS */
        }
        /* roboto-300 - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 300;
          src: url('../fonts/roboto-v29-latin-300.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-300.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-300.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-300.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-300.svg#Roboto') format('svg'); /* Legacy iOS */
        }
        /* roboto-regular - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: url('../fonts/roboto-v29-latin-regular.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-regular.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-regular.svg#Roboto') format('svg'); /* Legacy iOS */
        }
        /* roboto-500 - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 500;
          src: url('../fonts/roboto-v29-latin-500.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-500.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-500.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-500.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-500.svg#Roboto') format('svg'); /* Legacy iOS */
        }
        /* roboto-700 - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 700;
          src: url('../fonts/roboto-v29-latin-700.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-700.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-700.svg#Roboto') format('svg'); /* Legacy iOS */
        }
        /* roboto-900 - latin */
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 900;
          src: url('../fonts/roboto-v29-latin-900.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/roboto-v29-latin-900.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/roboto-v29-latin-900.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/roboto-v29-latin-900.woff') format('woff'), /* Modern Browsers */
              url('../fonts/roboto-v29-latin-900.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/roboto-v29-latin-900.svg#Roboto') format('svg'); /* Legacy iOS */
        }

        /* NOTE: Noto Sans KR */
        /* noto-sans-kr-100 - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 100;
          src: url('../fonts/noto-sans-kr-v25-korean-100.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-100.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-100.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-100.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-100.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-100.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
        /* noto-sans-kr-300 - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 300;
          src: url('../fonts/noto-sans-kr-v25-korean-300.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-300.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-300.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-300.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-300.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
        /* noto-sans-kr-regular - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 400;
          src: url('../fonts/noto-sans-kr-v25-korean-regular.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-regular.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-regular.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-regular.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-regular.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
        /* noto-sans-kr-500 - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 500;
          src: url('../fonts/noto-sans-kr-v25-korean-500.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-500.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-500.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-500.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-500.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
        /* noto-sans-kr-700 - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 700;
          src: url('../fonts/noto-sans-kr-v25-korean-700.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-700.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-700.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-700.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-700.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
        /* noto-sans-kr-900 - korean */
        @font-face {
          font-family: 'Noto Sans KR';
          font-style: normal;
          font-weight: 900;
          src: url('../fonts/noto-sans-kr-v25-korean-900.eot'); /* IE9 Compat Modes */
          src: local(''),
              url('../fonts/noto-sans-kr-v25-korean-900.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
              url('../fonts/noto-sans-kr-v25-korean-900.woff2') format('woff2'), /* Super Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-900.woff') format('woff'), /* Modern Browsers */
              url('../fonts/noto-sans-kr-v25-korean-900.ttf') format('truetype'), /* Safari, Android, iOS */
              url('../fonts/noto-sans-kr-v25-korean-900.svg#NotoSansKR') format('svg'); /* Legacy iOS */
        }
      `,
    },
  },
});

import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    contrastThreshold: 4.5,
  },
  typography: {
    allVariants: {
      fontFamily: [
        `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      ].join(','),
    },
  },
})

import { Box, CircularProgress } from "@mui/material"

export const Loader = () => (
    <Box
        sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <CircularProgress variant="indeterminate" />
    </Box>
)

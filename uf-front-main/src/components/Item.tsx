import { styled } from "@mui/material/styles"
import { Paper } from "@mui/material"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.15)",
}))

export default Item

import React from "react"
import ReactDOM from "react-dom/client"
import Provider from "./contexts"
import Router from "./routes"
import Global from "./styles/Global"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <Global />
        <Provider>
            <Router />
        </Provider>
    </React.StrictMode>
)

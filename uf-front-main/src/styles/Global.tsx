import { Global as G, css } from "@emotion/react"
import FontMaterialIconsWoff2 from "../assets/fonts/material-icons.woff2"
import FontRobotoV29LatinRegularWoff2 from "../assets/fonts/roboto-v29-latin-regular.woff2"
import FontRobotoV29LatinRegularWoff from "../assets/fonts/roboto-v29-latin-regular.woff"
import FontRobotoV29LatinItalicWoff2 from "../assets/fonts/roboto-v29-latin-italic.woff2"
import FontRobotoV29LatinItalicWoff from "../assets/fonts/roboto-v29-latin-italic.woff"
import FontRobotoV29Latin700Woff2 from "../assets/fonts/roboto-v29-latin-700.woff2"
import FontRobotoV29Latin700Woff from "../assets/fonts/roboto-v29-latin-700.woff"
import FontRobotoV29Latin700ItalicWoff2 from "../assets/fonts/roboto-v29-latin-700italic.woff2"
import FontRobotoV29Latin700ItalicWoff from "../assets/fonts/roboto-v29-latin-700italic.woff"

const Global = () => (
    <G
        styles={css`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Roboto, sans-serif;
            }
            a {
                text-decoration: none;
                color: inherit;
            }
            .material-icons {
                font-family: "Material Icons";
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -webkit-font-feature-settings: "liga";
                -webkit-font-smoothing: antialiased;
            }

            @font-face {
                font-family: "Material Icons";
                font-style: normal;
                font-weight: 400;
                src: url("${FontMaterialIconsWoff2}") format("woff2");
            }
            @font-face {
                font-family: "Roboto";
                font-style: normal;
                font-weight: 400;
                src: local(""),
                    url("${FontRobotoV29LatinRegularWoff2}") format("woff2"),
                    url("${FontRobotoV29LatinRegularWoff}") format("woff");
            }
            @font-face {
                font-family: "Roboto";
                font-style: italic;
                font-weight: 400;
                src: local(""),
                    url("${FontRobotoV29LatinItalicWoff2}") format("woff2"),
                    url("${FontRobotoV29LatinItalicWoff}") format("woff");
            }
            @font-face {
                font-family: "Roboto";
                font-style: normal;
                font-weight: 700;
                src: local(""),
                    url("${FontRobotoV29Latin700Woff2}") format("woff2"),
                    url("${FontRobotoV29Latin700Woff}") format("woff");
            }
            @font-face {
                font-family: "Roboto";
                font-style: italic;
                font-weight: 700;
                src: local(""),
                    url("${FontRobotoV29Latin700ItalicWoff2}") format("woff2"),
                    url("${FontRobotoV29Latin700ItalicWoff}") format("woff");
            }
        `}
    />
)

export default Global

import React from "react";
import {Tooltip} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoTooltipProps {
    info: string
    sx?: any
}

export default function InfoTooltip(props: InfoTooltipProps) {
    return (
        <Tooltip title={props.info} sx={props.sx}>
            <InfoOutlinedIcon/>
        </Tooltip>
    );
}
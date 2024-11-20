import React from "react";
import {Tooltip} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoTooltipProps {
    info: string
    sx?: any
}

export default function InfoTooltip(props: InfoTooltipProps) {
    let sx: any = {...props.sx};
    sx['color'] = 'black';

    return (
        <Tooltip title={props.info} sx={sx}>
            <InfoOutlinedIcon/>
        </Tooltip>
    );
}
import React from "react";
import {LinearProgress, Typography} from "@mui/material";

interface LoadingProps {
    show: boolean
    progress?: string
}

export default function LoadingPanel(props: LoadingProps) {
    if (props.show) {
        return (
            <div className="loading-panel" id="notes-loading">
                <div className="loading-body">
                    {props.progress &&
                        <Typography variant='subtitle1' color='secondary'>
                            {props.progress}
                        </Typography>
                    }
                    <div className="loading-bar" style={{color: 'white'}}>
                        <LinearProgress color='inherit'/>
                    </div>
                </div>
            </div>
        );
    }
}
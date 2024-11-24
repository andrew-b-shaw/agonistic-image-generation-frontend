import React from "react";
import {Typography} from "@mui/material";

interface ImageGridProps {
    images: string[],
    prompt: string,
    style?: any
}

export default function ImageGrid(props: ImageGridProps) {
    return (props.images.length > 0 ?
        <div className="image-grid" style={props.style}>
            <img src={props.images[0]} alt={props.prompt} className="generated-image" style={{gridRow: 1, gridColumn: 1}}/>
            <img src={props.images[1]} alt={props.prompt} className="generated-image" style={{gridRow: 1, gridColumn: 2}}/>
            <img src={props.images[2]} alt={props.prompt} className="generated-image" style={{gridRow: 2, gridColumn: 1}}/>
            <img src={props.images[3]} alt={props.prompt} className="generated-image" style={{gridRow: 2, gridColumn: 2}}/>
        </div> :
        <div className="image-grid" style={props.style}>
            <div className="image-placeholder" style={{gridRow: 1, gridColumn: 1}}/>
            <div className="image-placeholder" style={{gridRow: 1, gridColumn: 2}}/>
            <div className="image-placeholder" style={{gridRow: 2, gridColumn: 1}}/>
            <div className="image-placeholder" style={{gridRow: 2, gridColumn: 2}}/>
            <Typography
                variant='subtitle1'
                className="center-content"
                sx={{
                    textAlign: 'center',
                    width: '200px',
                    background: 'rgba(255, 255, 255, 0.75)'
                }}
            >
                Generated images will appear here
            </Typography>
        </div>
    );
}
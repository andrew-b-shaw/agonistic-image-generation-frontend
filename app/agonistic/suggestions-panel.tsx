'use client'

import React from "react";
import Suggestion from "./suggestion";
import TextEntryField from "../text-entry-field";

import {Typography, Accordion, AccordionSummary, AccordionDetails, Button, Link, IconButton, Divider, Stack, Tooltip} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

interface SuggestionsProps {
    phrase: string
    suggestions: Suggestion[]
    onAccept: (suggestion: string) => any
    onClose: () => any
}

interface SuggestionsState {
    expanded: number | false
}

class SuggestionsPanel extends React.Component<SuggestionsProps, SuggestionsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    handleChange = (key: number) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            this.setState({
                expanded: isExpanded ? key : false
            });
        };

    handleOpenSource = (suggestion: Suggestion) => {
        let contents: string[] = suggestion.source.split(" - ");
        let url: string = ("https://en.wikipedia.org/wiki/" + contents[0] + "#" + contents[1]).replaceAll(" ", "_");
        window.open(url);
    }

    render() {
        return (
            <div id="suggestions-panel">
                <Stack direction='row'>
                    <Typography variant='h5'>
                        {"'" + this.props.phrase + "' Interpretations"}
                    </Typography>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={this.props.onClose}
                            sx={{position: 'absolute', right: '10px'}}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>

                <div id="suggestions-accordion">
                    <Divider/>
                    {this.props.suggestions.map((suggestion, key) => (
                        <Accordion
                            key={key}
                            expanded={this.state.expanded === key}
                            onChange={this.handleChange(key)}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Stack direction='row'>
                                    <div className="suggestion-thumbnail-container">
                                        <img className="suggestion-thumbnail" src={suggestion.thumbnail} alt=""/>
                                    </div>
                                    <div className="suggestion-title-container">
                                        <Typography variant='body1'>{suggestion.text}</Typography>
                                        <Typography variant='body2' color='text.secondary' sx={{'pt': '10px'}}>Source: {suggestion.source}</Typography>
                                    </div>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant='body1' color='text.secondary'>
                                    {suggestion.justification.toUpperCase().charAt(0) +
                                        suggestion.justification.substring(1) +
                                        (suggestion.justification.charAt(suggestion.justification.length - 1) === '.' ? "" : ".") +
                                        " This interpretation is unique because it " + suggestion.unique +
                                        (suggestion.unique.charAt(suggestion.unique.length - 1) === '.' ? "" : ".") + " "
                                    }
                                    <Link onClick={() => this.handleOpenSource(suggestion)}>
                                        {"(Source: " + suggestion.source + ")"}
                                    </Link>
                                </Typography>
                                <Button
                                    onClick={() => this.props.onAccept(suggestion.text)}
                                    sx={{display: 'block', marginLeft: 'auto', marginRight: 0}}
                                >
                                    Accept
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                <TextEntryField
                    placeholder="Write your own interpretation or leave it ambiguous!"
                    onAccept={this.props.onAccept}
                    tooltip="Accept"
                    sx={{width: 'calc(100% - 34px)', position: 'absolute', bottom: '10px'}}
                />
            </div>
        );
    }
}

export default SuggestionsPanel;
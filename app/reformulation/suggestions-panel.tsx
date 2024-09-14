'use client'

import React from "react";
import InfoTooltip from "@/app/info-tooltip";
import {Button, Stack, Paper, Divider, ButtonBase, Typography} from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";

interface SuggestionProps {
    suggestions: string[]
    onAccept: (suggestion: string) => any
}

interface SuggestionsState {
    expanded: string | false
    size: number
}

class SuggestionsPanel extends React.Component<SuggestionProps, SuggestionsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            size: 5
        };
    }

    render() {
        return (
            <div id="suggestions-panel">
                <Stack direction='row' sx={{mb: '20px'}}>
                    <Typography variant='h4'>
                        Suggestions
                    </Typography>
                    <InfoTooltip
                        sx={{position: 'absolute', right: '30px'}}
                        info="Your prompt may contain ambiguity or unconscious bias. Reformulate your prompt with the help of AI below. You can choose to keep your prompt as is or edit the suggestions in the text box above after clicking them."
                    />
                </Stack>
                {this.props.suggestions.length > 0 &&
                    <div id="suggestions-list">
                        <Paper>
                            <Stack>
                                {this.props.suggestions.slice(0, this.state.size).map((suggestion, key) => (
                                    <ButtonBase key={key} onClick={() => this.props.onAccept(suggestion)} sx={{width: 1}}>
                                        <div className="suggestion">
                                            <div className="suggestion-body">
                                                <Stack direction='row'>
                                                    <Typography variant='body2' sx={{textAlign: 'left', marginRight: '10px'}}>
                                                        {suggestion}
                                                    </Typography>
                                                    <NorthEastIcon fontSize='small'/>
                                                </Stack>
                                            </div>
                                            <Divider/>
                                        </div>
                                    </ButtonBase>
                                ))}
                            </Stack>
                        </Paper>
                        <Button
                            onClick={() => this.setState({size: this.state.size + 5})}
                            disabled={this.state.size >= this.props.suggestions.length}
                        >
                            See More
                        </Button>
                    </div>
                }
            </div>
        )
    }
}

export default SuggestionsPanel;
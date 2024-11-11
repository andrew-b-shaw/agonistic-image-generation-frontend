import {Accordion, AccordionDetails, AccordionSummary, Button, Link, Stack, Tooltip, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import React, {useState} from "react";
import Interpretation from "@/app/agonistic/interpretation";

interface IIProps {
    expanded: boolean
    interpretation: Interpretation
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => any
    onAccept: (text: string) => any
}

export default function InterpretationItem(props: IIProps) {
    const [acceptEnabled, setAcceptEnabled] = useState<boolean>(false);

    const delayAccept = async () => {
        setAcceptEnabled(false);
        setTimeout(() => setAcceptEnabled(true), 3000);
    }

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        props.onChange(event, isExpanded);
        if (isExpanded) {
            delayAccept();
        }
    }

    const handleOpenSource = () => {
        let contents: string[] = props.interpretation.source.split(" - ");
        let url: string = ("https://en.wikipedia.org/wiki/" + contents[0] + "#" + contents[1]).replaceAll(" ", "_");
        window.open(url);
    }

    return (
        <Accordion
            expanded={props.expanded}
            onChange={handleChange}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Stack direction='row'>
                <div className="suggestion-thumbnail-container">
                    <img className="suggestion-thumbnail" src={props.interpretation.thumbnail} alt=""/>
                </div>
                <div className="suggestion-title-container">
                    <Typography variant='body1'>{props.interpretation.text}</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{'pt': '10px'}}>Source: {props.interpretation.source}</Typography>
                    {
                        props.interpretation.confrontation === "high" &&
                        <Tooltip title="Suggested" sx={{position: 'absolute', right: "10px", top: "10px", color: "red"}}>
                            <PriorityHighIcon fontSize='large'/>
                        </Tooltip>
                    }

                </div>
            </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant='body1' color='text.secondary'>
                    {props.interpretation.justification + " "
                        // + " This interpretation is unique because it " + suggestion.unique +
                        // (suggestion.unique.charAt(suggestion.unique.length - 1) === '.' ? "" : ".")
                    }
                    <Link onClick={handleOpenSource}>(Click to See More)</Link>
                </Typography>
                <Button
                    onClick={() => props.onAccept(props.interpretation.text)}
                    disabled={!acceptEnabled}
                    sx={{display: 'block', marginLeft: 'auto', marginRight: 0}}
                >
                    Accept
                </Button>
            </AccordionDetails>
        </Accordion>
    );
}
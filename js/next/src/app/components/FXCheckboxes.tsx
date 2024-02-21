import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FXGroupsArray } from '@/interfaces/audioInterfaces';
import { Box } from '@mui/material';


export default function FXCheckboxLabels(props: FXGroupsArray) {
    const {fxGroupsArrayList, handleFXGroupChange, updateCheckedFXList, fxValsRef, checkedFXList} = props;
    const fxGroupsArrayListNoDupes = fxGroupsArrayList.length > 8 ? fxGroupsArrayList.filter((item: any, index: number) => fxGroupsArrayList[index] = item) : fxGroupsArrayList;
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            key={`outer_wrapper_fx_accordion`}
            sx={{
                position: 'absolute', 
                right: '0', 
                top: '44px'
            }}
        >
            {
                fxGroupsArrayListNoDupes && fxGroupsArrayListNoDupes.map((fxG: any, idx: number) => {
                    return (
                        <Accordion
                            sx={{
                                backgroundColor: 'rgba(0,0,0,0.68)',
                                color: 'rgba(255,255,255,0.87)',
                                paddingTop: '0px',
                                paddingBottom: '0px',
                                margin: '0px !important',
                            }}
                            expanded={expanded === `panel${idx}`} onChange={handleChange(`panel${idx}`)}
                            key={`${fxG.label.replace(' ','_')}_fx_accordion`}
                        >
                            <AccordionSummary
                                key={`${fxG.label.replace(' ','_')}_fx_accordion_summary`}
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    maxHeight: '32px',
                                    paddingTop: '0px',
                                    paddingBottom: '0px',
                                    margin: '0px',
                                }}
                            >
                                <Typography key={`${fxG.label.replace(' ','_')}_fx_accordion_label`}>{fxG.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails 
                                key={`${fxG.label.replace(' ','_')}_fx_accordion_details`}
                                sx={{
                                    paddingTop: '0px',
                                    paddingBottom: '0px',
                                    margin: '0px',
                                }}
                            >
                                <Typography sx={{margin: '0px', display: 'flex', flexDirection: 'column'}} key={`${fxG.label.replace(' ','_')}_fx_accordion_fx_dropdown`}>
                                    {fxG.effects.map((fxE: any) => {
                                        const isChecked = checkedFXList.indexOf(fxE.effectVar) !== -1 ? true : false;
                                        return (
                                            <FormControlLabel 
                                                key={`${fxE.effectLabel.replace(' ','_')}_fx_checkbox`} 
                                                onChange={(e) => handleFXGroupChange(e)} 
                                                control={
                                                        <Checkbox 
                                                            checked={isChecked} 
                                                            id={fxE.effectLabel.replace(' ','_')}
                                                            onChange={updateCheckedFXList}
                                                        /> 
                                                } 
                                                label={fxE.effectLabel || ''} 
                                                value={fxE.effectVar || ''} 
                                            />
                                        )
                                    })}                            
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </Box>
    );
}
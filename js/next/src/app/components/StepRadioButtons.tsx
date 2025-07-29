import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"

type StepRadioBtnProps = {
    doAutoAssignPatternNumber: number | null;
    handleAssignPatternNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const StepRadioButtons = (props: StepRadioBtnProps) => {
    const { doAutoAssignPatternNumber, handleAssignPatternNumber } = props;
    return (
                            <FormControl>
                              {/* <FormLabel>Repeats</FormLabel> */}
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={doAutoAssignPatternNumber ? doAutoAssignPatternNumber.toString() : "0"}
                                name="radio-buttons-group"
                                onChange={handleAssignPatternNumber}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row", 
                                }}
                              >
                                <FormControlLabel value="0" control={<Radio />} label="0" />
                                <FormControlLabel value="1" control={<Radio />} label="2" />
                                <FormControlLabel value="2" control={<Radio />} label="4" />
                                <FormControlLabel value="3" control={<Radio />} label="8" />
                                <FormControlLabel value="4" control={<Radio />} label="16" />
                              </RadioGroup>
                            </FormControl>
    )
};
export default StepRadioButtons;
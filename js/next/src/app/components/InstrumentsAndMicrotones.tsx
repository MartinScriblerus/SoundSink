import STKManagerDropdown from "./STKManagerDropdown";
import CustomAriaLive from './MicrotonesSearch';
import { STKOption } from "@/utils/fixedOptionsDropdownData";
import { Dispatch } from "react";
import {Tune} from '../../tune';

type InstrumentsAndMicrotonesProps = {
    updateStkKnobs: (x: STKOption[]) => void,
    stkValues: STKOption[],
    setStkValues: React.Dispatch<React.SetStateAction<any>>,
    tune: Tune,
    currentMicroTonalScale: (scale: any) => void,
}

const InstrumentsAndMicrotones = (
    props: InstrumentsAndMicrotonesProps
) => {
    const { updateStkKnobs, stkValues, setStkValues, tune, currentMicroTonalScale } = props;
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "100%",
        }}>
            <STKManagerDropdown
                updateStkKnobs={updateStkKnobs}
                stkValues={stkValues}
                setStkValues={setStkValues}
            ></STKManagerDropdown>
            <CustomAriaLive 
                tune={tune} 
                currentMicroTonalScale={currentMicroTonalScale} 
            />
        </div>
    )
};
export default InstrumentsAndMicrotones;
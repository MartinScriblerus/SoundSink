import CustomAriaLive from './MicrotonesSearch';
import { Dispatch } from "react";
import {Tune} from '../../tune';


type InstrumentsAndMicrotonesProps = {
    tune: Tune,
    currentMicroTonalScale: (scale: any) => void,
    setFxKnobsCount: Dispatch<React.SetStateAction<number>>,
    doUpdateBabylonKey: (value: string) => void,
    getSTK1Preset: (x: string) => any,
    updateMicroTonalScale: (scale: any) => void,
}


const InstrumentsAndMicrotones = (
    props: InstrumentsAndMicrotonesProps
) => {
    const { 
        tune, 
        currentMicroTonalScale,
        updateMicroTonalScale
    } = props;
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
        }}>
            <CustomAriaLive 
                tune={tune} 
                currentMicroTonalScale={currentMicroTonalScale} 
                updateMicroTonalScale={updateMicroTonalScale}
            />
        </div>
    )
};
export default InstrumentsAndMicrotones;
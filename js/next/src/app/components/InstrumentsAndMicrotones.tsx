import STKManagerDropdown from "./STKManagerDropdown";
import CustomAriaLive from './MicrotonesSearch';
import { STKOption } from "@/utils/fixedOptionsDropdownData";
import { Dispatch } from "react";
import {Tune} from '../../tune';
import { currentScreen, moogGrandmotherEffects, stkKnobValsRef, visibleFXKnobs } from "../state/refs";
import { EffectsSettings } from "@/types/audioTypes";

type InstrumentsAndMicrotonesProps = {
    stkValues: STKOption[],
    setStkValues: React.Dispatch<React.SetStateAction<any>>,
    tune: Tune,
    currentMicroTonalScale: (scale: any) => void,
    setFxKnobsCount: Dispatch<React.SetStateAction<number>>,
    doUpdateBabylonKey: (value: string) => void,
    babylonKey: string,
    setNeedsUpdate: Dispatch<React.SetStateAction<boolean>>,
    currentScreen: React.MutableRefObject<string>,
    currentFX: React.MutableRefObject<any>,
    currentStkTypeVar: React.MutableRefObject<string>,
    universalSources: React.MutableRefObject<any>,
    updateCurrentFXScreen: (
        setFxKnobsCount: Dispatch<React.SetStateAction<number>>,
        doUpdateBabylonKey: (value: string) => void,
        babylonKey: string
    ) => void,  
    universalSourcesRef: React.MutableRefObject<any>,
    getSTK1Preset: (x: string) => any,
    
}


const InstrumentsAndMicrotones = (
    props: InstrumentsAndMicrotonesProps
) => {
    const { 
        // updateStkKnobs, 
        stkValues, 
        setStkValues, 
        tune, 
        currentMicroTonalScale,
        setFxKnobsCount,
        doUpdateBabylonKey,
        babylonKey,
        setNeedsUpdate, 
        updateCurrentFXScreen,
        currentStkTypeVar,
        universalSources,
        getSTK1Preset,
        currentFX,
    } = props;

        const updateStkKnobs = (knobVals: STKOption[]) => {
            console.log("yup knobs: ", knobVals)
            stkKnobValsRef.current = [];
            stkKnobValsRef.current.push(...knobVals);
            if (!stkKnobValsRef.current[stkKnobValsRef.current.length - 1]) {
                
                visibleFXKnobs.current = Object.values(moogGrandmotherEffects.current).map((i: any) => [i.label, i]);
                setFxKnobsCount(moogGrandmotherEffects.current.length);
                updateCurrentFXScreen(        
                    setFxKnobsCount,
                    doUpdateBabylonKey,
                    babylonKey );
                setNeedsUpdate(true);
                return;
            }
            const getSTKVal = getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value);
            currentStkTypeVar.current = (`${getSTKVal.type}#${getSTKVal.var}`)
            if (universalSources.current) {
                console.log('@@@@@@@@@@@ knob vals / STK VALS REF CURRENT ', getSTKVal);
                const stk: any = universalSources.current.stk1
                visibleFXKnobs.current = Object.values(getSTK1Preset(stkKnobValsRef.current[stkKnobValsRef.current.length - 1].value).presets).map((i: any) => [i.label, i]);
                const instType = getSTKVal.type
                currentFX.current = getSTKVal.value;
                if (universalSources.current.stk1.instruments) {
                    Object.entries(universalSources.current.stk1.instruments).map((i: [string, EffectsSettings | any]) => {
                        if (i && i.length > 0 && i[0] === instType) {
                            i[1].Visible = true;
                            i[1].On = true;
                            if (i[1].presets) i[1].presets = Object.values(getSTKVal.presets);
                        } else {
                            i[1].Visible = false
                        }
                    })
                }
                setFxKnobsCount(visibleFXKnobs.current.length);
                currentFX.current = getSTKVal;
    
    
                currentScreen.current = `stk_${currentFX.current.type}`;
    
                if (Object.values(stk.instruments).filter((inst: any) => inst.On).length > 0) {
    
                    stk.instruments[`${getSTKVal.type}`].Type = getSTKVal.type; ///// LOOK HERE!!!!
                    stk.instruments[`${getSTKVal.type}`].VarName = getSTKVal.var;
                    stk.instruments[`${getSTKVal.type}`].On = true;
    
                    currentFX.current = stkKnobValsRef.current;
    
                    const knobsCountTemp = Object.values(stk.instruments).filter((i: any) => i.Visible).map((i: any) => i.presets).length;
    
                    setFxKnobsCount(knobsCountTemp);
                    updateCurrentFXScreen(
                        setFxKnobsCount,
                        doUpdateBabylonKey,
                        babylonKey,
                    );
                }
            }
        }
    
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
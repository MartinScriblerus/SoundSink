export type STKOption = {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  };
  
  export const stkOptions: readonly STKOption[] = [
    { value: 'clarinet', label: 'Clarinet', color: 'rgb(144/255, 204/255, 212/255)' }, // presets written
    { value: 'stifkrp', label: 'Karplus', color: 'rgb(144/255, 204/255, 212/255)' }, // presets written
    { value: 'sitar', label: 'Sitar', color: 'rgb(144/255, 204/255, 212/255)' }, // presets written
    { value: 'moog', label: 'Moog', color: 'rgb(158/255, 210/255, 162/255)'}, // preset written
    { value: 'frenchhorn', label: 'French Horn', color: 'rgb(158/255, 210/255, 162/255)' }, // *** preset written
    { value: 'rhodey', label: 'Rhodey', color: 'rgb(236/255, 128/255, 139/255)' }, // *** preset written
    { value: 'saxofony', label: 'Saxofony', color: 'rgb(144/255, 204/255, 212/255)' }, // preset written
    
    { value: 'mandolin', label: 'Mandolin', color: 'rgb(144/255, 204/255, 212/255)' }, // preset written
    { value: 'bandedWg', label: 'Banded WaveGuide', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'blowbotl', label: 'Bottle', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'blowhole', label: 'BlowHole', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'bowed', label: 'Bowed', color: 'rgb(144/255, 204/255, 212/255)'}, // preset written
    { value: 'brass', label: 'Brass', color: 'rgb(144/255, 204/255, 212/255)' }, // preset written
    { value: 'flute', label: 'Flute', color: 'rgb(144/255, 204/255, 212/255)' }, // preset written
    { value: 'modalBar', label: 'Modal Bar', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'shakers', label: 'Shakers', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'voiceForm', label: 'Voice Form', color: 'rgb(158/255, 210/255, 162/255)' }, // preset written
    { value: 'beeThree', label: 'B3', color: 'rgb(236/255, 128/255, 139/255)' }, // *** preset written
    

    { value: 'fm', label: 'FM', color: 'rgb(236/255, 128/255, 139/255)' }, // *** preset written
    { value: 'fmVoices', label: 'FM Voices', color: 'rgb(236/255, 128/255, 139/255 )' }, // *** preset written
    { value: 'krstlChr', label: 'Crystal Choir', color: 'rgb(236/255, 128/255, 139/255 )' }, // *** preset written
    { value: 'percFlute', label: 'PercFlute', color: 'rgb(236/255, 128/255, 139/255)'}, // *** preset writtem
    { value: 'tubeBell', label: 'Tube Bell', color: 'rgb(236/255, 128/255, 139/255)' }, // *** preset written
    { value: 'wurley', label: 'Wurley', color: 'rgb(236/255, 128/255, 139/255)' }, // *** preset written

    { value: 'delay', label: 'Delay Line', color: 'rgb(158/255, 210/255, 162/255)' }, // 
    { value: 'delayA', label: 'Fractional Delay Line', color: 'rgb(158/255, 210/255, 162/255)' },
    { value: 'delayL', label: 'Fractional Linear Delay Line', color: 'rgb(158/255, 210/255, 162/255)' },
    { value: 'echo', label: 'Echo', color: 'rgb(158/255, 210/255, 162/255)' },
    { value: 'chorus', label: 'Chorus', color: 'rgb(158/255, 210/255, 162/255)' },
  ];
  
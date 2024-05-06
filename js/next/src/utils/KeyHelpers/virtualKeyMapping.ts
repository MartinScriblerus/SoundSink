export const virtualKeyMapping = (rootNote: number, msgDownOrUp: number) => {
    
    return `
    ${msgDownOrUp} => int msgDownOrUp;

 

    oCp.notes @=> int notesArrHid[];

    if ( msg.which == 9 ) {
        if (msgDownOrUp == 0) {
            ${0} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${0} >>>;
            // oCp.notes << ${0};
            oCp.notes => oCp.playNotes;
        }
    }

    if ( msg.which == 49 ) {
        if (msgDownOrUp == 0) {
            ${1} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${1} >>>;
            // oCp.notes << ${1};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 50 ) {
        if (msgDownOrUp == 0) {
            ${3} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${3} >>>;
            oCp.notes << ${3};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 52 ) {
        if (msgDownOrUp == 0) {
            ${6} => oCp.releaseNotes;

        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${6} >>>;
            oCp.notes << ${6};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 53 ) {
        if (msgDownOrUp == 0) {
            ${8} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${8} >>>;
            oCp.notes << ${8};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 54 ) {
        if (msgDownOrUp == 0) {
            ${10} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${10} >>>;
            oCp.notes << ${10};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 56 ) {
        if (msgDownOrUp == 0) {
            ${13} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${13} >>>;
            oCp.notes << ${13};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 57 ) {
        if (msgDownOrUp == 0) {
            ${15} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${15} >>>;
            oCp.notes << ${15};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 81 ) {
        if (msgDownOrUp == 0) {
            ${2} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${2} >>>;
            oCp.notes << ${2};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 87 ) {
        if (msgDownOrUp == 0) {
            ${4} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${4} >>>;
            oCp.notes << ${4};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 69 ) {
        if (msgDownOrUp == 0) {
            ${5} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${5} >>>;
            oCp.notes << ${5};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 82 ) {
        if (msgDownOrUp == 0) {
            ${7} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${7} >>>;
            oCp.notes << ${7};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 84 ) {
        if (msgDownOrUp == 0) {
            ${9} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${9} >>>;
            oCp.notes << ${9};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 89 ) {
        if (msgDownOrUp == 0) {
            ${11} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${11} >>>;
            oCp.notes << ${11};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 85 ) {
        if (msgDownOrUp == 0) {
            ${12} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${12} >>>;
            oCp.notes << ${12};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 73 ) {
        if (msgDownOrUp == 0) {
            ${14} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${14} >>>;
            oCp.notes << ${14};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 79 ) {
        if (msgDownOrUp == 0) {
            ${16} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${16} >>>;
            oCp.notes << ${16};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 80 ) {
        if (msgDownOrUp == 0) {
            ${17} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${17} >>>;
            oCp.notes << ${17};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 90 ) {
        if (msgDownOrUp == 0) {
            ${19} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${19} >>>;
            oCp.notes << ${19};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 88 ) {
        if (msgDownOrUp == 0) {
            ${21} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${21} >>>;
            oCp.notes << ${21};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 67 ) {
        if (msgDownOrUp == 0) {
            ${23} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${23} >>>;
            oCp.notes << ${23};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 86 ) {
        if (msgDownOrUp == 0) {
            ${24} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${24} >>>;
            oCp.notes << ${24};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 66 ) {
        if (msgDownOrUp == 0) {
            ${26} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${26} >>>;
            oCp.notes << ${26};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 78 ) {
        if (msgDownOrUp == 0) {
            ${28} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${28} >>>;
            oCp.notes << ${28};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 77 ) {
        if (msgDownOrUp == 0) {
            ${29} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${29} >>>;
            oCp.notes << ${29};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 188 ) {
        if (msgDownOrUp == 0) {
            ${31} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${31} >>>;
            oCp.notes << ${31};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 190 ) {
        if (msgDownOrUp == 0) {
            ${33} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${33} >>>;
            oCp.notes << ${33};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 191 ) {
        if (msgDownOrUp == 0) {
            ${35} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${35} >>>;
            oCp.notes << ${35};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 16 ) {
        if (msgDownOrUp == 0) {
            ${36} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${36} >>>;
            oCp.notes << ${36};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 65 ) {
        if (msgDownOrUp == 0) {
            ${18} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${18} >>>;
            oCp.notes << ${18};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 83 ) {
        if (msgDownOrUp == 0) {
            ${20} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${20} >>>;
            oCp.notes << ${20};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 68 ) {
        if (msgDownOrUp == 0) {
            ${22} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${22} >>>;
            oCp.notes << ${22};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 71 ) {
        if (msgDownOrUp == 0) {
            ${25} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${25} >>>;
            oCp.notes << ${25};
            oCp.notes => oCp.playNotes;
        }
    }
    if ( msg.which == 72 ) {
        if (msgDownOrUp == 0) {
            ${27} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${27} >>>;
            oCp.notes << ${27};
            oCp.notes => oCp.playNotes;
        }
    }
   
    if ( msg.which == 186 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT L UP! ", ${33} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT L DOWN! ", ${33} >>>;
        }
    }





    `;
}
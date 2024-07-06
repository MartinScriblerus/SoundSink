export const virtualKeyMapping = (rootNote: number, msgDownOrUp: number) => {
    
    return `
    ${msgDownOrUp} => msgDownOrUp;

    <<< "VIRTUALKEYUPDATE_", msgDownOrUp, msg.key, msg.which >>>;

    if ( msg.which == 9 ) {
        if (msgDownOrUp == 0) {
            ${0} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${0} => oCp.playNotes;
        }
    }

    if ( msg.which == 49 ) {
        if (msgDownOrUp == 0) {
            ${1} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${1} => oCp.playNotes;
        }
    }
    if ( msg.which == 50 ) {
        if (msgDownOrUp == 0) {
            ${3} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${3} => oCp.playNotes;
        }
    }
    if ( msg.which == 52 ) {
        if (msgDownOrUp == 0) {
            ${6} => oCp.releaseNotes;

        } else if (msgDownOrUp == 1) {
            ${6} => oCp.playNotes;
        }
    }
    if ( msg.which == 53 ) {
        if (msgDownOrUp == 0) {
            ${8} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${8} => oCp.playNotes;
        }
    }
    if ( msg.which == 54 ) {
        if (msgDownOrUp == 0) {
            ${10} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
           ${10} => oCp.playNotes;
        }
    }
    if ( msg.which == 56 ) {
        if (msgDownOrUp == 0) {
            ${13} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${13} => oCp.playNotes;
        }
    }
    if ( msg.which == 57 ) {
        if (msgDownOrUp == 0) {
            ${15} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${15} => oCp.playNotes;
        }
    }
    if ( msg.which == 81 ) {
        if (msgDownOrUp == 0) {
            ${2} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${2} => oCp.playNotes;
        }
    }
    if ( msg.which == 87 ) {
        if (msgDownOrUp == 0) {
            ${4} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${4} => oCp.playNotes;
        }
    }
    if ( msg.which == 69 ) {
        if (msgDownOrUp == 0) {
            ${5} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${5} => oCp.playNotes;
        }
    }
    if ( msg.which == 82 ) {
        if (msgDownOrUp == 0) {
            ${7} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${7} => oCp.playNotes;
        }
    }
    if ( msg.which == 84 ) {
        if (msgDownOrUp == 0) {
            ${9} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${9} => oCp.playNotes;
        }
    }
    if ( msg.which == 89 ) {
        if (msgDownOrUp == 0) {
            ${11} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${11} => oCp.playNotes;
        }
    }
    if ( msg.which == 85 ) {
        if (msgDownOrUp == 0) {
            ${12} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${12} => oCp.playNotes;
        }
    }
    if ( msg.which == 73 ) {
        if (msgDownOrUp == 0) {
            ${14} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${14} => oCp.playNotes;
        }
    }
    if ( msg.which == 79 ) {
        if (msgDownOrUp == 0) {
            ${16} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${16} => oCp.playNotes;
        }
    }
    if ( msg.which == 80 ) {
        if (msgDownOrUp == 0) {
            ${17} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${17} => oCp.playNotes;
        }
    }
    if ( msg.which == 90 ) {
        if (msgDownOrUp == 0) {
            ${19} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${19} => oCp.playNotes;
        }
    }
    if ( msg.which == 88 ) {
        if (msgDownOrUp == 0) {
            ${21} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${21} => oCp.playNotes;
        }
    }
    if ( msg.which == 67 ) {
        if (msgDownOrUp == 0) {
            ${23} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${23} => oCp.playNotes;
        }
    }
    if ( msg.which == 86 ) {
        if (msgDownOrUp == 0) {
            ${24} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${24} => oCp.playNotes;
        }
    }
    if ( msg.which == 66 ) {
        if (msgDownOrUp == 0) {
            ${26} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${26} => oCp.playNotes;
        }
    }
    if ( msg.which == 78 ) {
        if (msgDownOrUp == 0) {
            ${28} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${28} => oCp.playNotes;
        }
    }
    if ( msg.which == 77 ) {
        if (msgDownOrUp == 0) {
            ${29} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${29} => oCp.playNotes;
        }
    }
    if ( msg.which == 188 ) {
        if (msgDownOrUp == 0) {
            ${31} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${31} => oCp.playNotes;
        }
    }
    if ( msg.which == 190 ) {
        if (msgDownOrUp == 0) {
            ${33} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${33} => oCp.playNotes;
        }
    }
    if ( msg.which == 191 ) {
        if (msgDownOrUp == 0) {
            ${35} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${35} => oCp.playNotes;
        }
    }
    if ( msg.which == 16 ) {
        if (msgDownOrUp == 0) {
            ${36} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${36} => oCp.playNotes;
        }
    }
    if ( msg.which == 65 ) {
        if (msgDownOrUp == 0) {
            ${18} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${18} => oCp.playNotes;
        }
    }
    if ( msg.which == 83 ) {
        if (msgDownOrUp == 0) {
            ${20} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${20} => oCp.playNotes;
        }
    }
    if ( msg.which == 68 ) {
        if (msgDownOrUp == 0) {
            ${22} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${22} => oCp.playNotes;
        }
    }
    if ( msg.which == 71 ) {
        if (msgDownOrUp == 0) {
            ${25} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${25} => oCp.playNotes;
        }
    }
    if ( msg.which == 72 ) {
        if (msgDownOrUp == 0) {
            ${27} => oCp.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${27} => oCp.playNotes;
        }
    }
   
    if ( msg.which == 186 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT L UP! ", ${33} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT L DOWN! ", ${33} >>>;
        }
    }
    // else {
    //     <<< "MSG WHICH IN ELSE IS ", msg.which >>>;
    // }




    `;
}
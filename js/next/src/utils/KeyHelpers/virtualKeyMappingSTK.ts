export const virtualKeyMappingSTK = (rootNote: number, msgDownOrUp: number) => {
    
    return `
    ${msgDownOrUp} => int msgDownOrUp;

    // <<< "VIRTUALKEYUPDATE_", msgDownOrUp, msg.key >>>;

    if ( msg.which == 9 ) {
        if (msgDownOrUp == 0) {
            ${0} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${0} => oCpSTK.playNotes;
        }
    }

    if ( msg.which == 49 ) {
        if (msgDownOrUp == 0) {
            ${1} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${1} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 50 ) {
        if (msgDownOrUp == 0) {
            ${3} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${3} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 52 ) {
        if (msgDownOrUp == 0) {
            ${6} => oCpSTK.releaseNotes;

        } else if (msgDownOrUp == 1) {
            ${6} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 53 ) {
        if (msgDownOrUp == 0) {
            ${8} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${8} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 54 ) {
        if (msgDownOrUp == 0) {
            ${10} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
           ${10} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 56 ) {
        if (msgDownOrUp == 0) {
            ${13} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${13} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 57 ) {
        if (msgDownOrUp == 0) {
            ${15} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${15} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 81 ) {
        if (msgDownOrUp == 0) {
            ${2} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${2} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 87 ) {
        if (msgDownOrUp == 0) {
            ${4} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${4} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 69 ) {
        if (msgDownOrUp == 0) {
            ${5} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${5} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 82 ) {
        if (msgDownOrUp == 0) {
            ${7} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${7} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 84 ) {
        if (msgDownOrUp == 0) {
            ${9} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${9} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 89 ) {
        if (msgDownOrUp == 0) {
            ${11} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${11} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 85 ) {
        if (msgDownOrUp == 0) {
            ${12} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${12} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 73 ) {
        if (msgDownOrUp == 0) {
            ${14} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${14} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 79 ) {
        if (msgDownOrUp == 0) {
            ${16} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${16} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 80 ) {
        if (msgDownOrUp == 0) {
            ${17} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${17} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 90 ) {
        if (msgDownOrUp == 0) {
            ${19} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${19} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 88 ) {
        if (msgDownOrUp == 0) {
            ${21} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${21} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 67 ) {
        if (msgDownOrUp == 0) {
            ${23} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${23} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 86 ) {
        if (msgDownOrUp == 0) {
            ${24} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${24} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 66 ) {
        if (msgDownOrUp == 0) {
            ${26} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${26} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 78 ) {
        if (msgDownOrUp == 0) {
            ${28} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${28} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 77 ) {
        if (msgDownOrUp == 0) {
            ${29} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${29} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 188 ) {
        if (msgDownOrUp == 0) {
            ${31} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${31} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 190 ) {
        if (msgDownOrUp == 0) {
            ${33} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${33} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 191 ) {
        if (msgDownOrUp == 0) {
            ${35} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${35} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 16 ) {
        if (msgDownOrUp == 0) {
            ${36} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${36} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 65 ) {
        if (msgDownOrUp == 0) {
            ${18} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${18} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 83 ) {
        if (msgDownOrUp == 0) {
            ${20} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${20} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 68 ) {
        if (msgDownOrUp == 0) {
            ${22} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${22} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 71 ) {
        if (msgDownOrUp == 0) {
            ${25} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${25} => oCpSTK.playNotes;
        }
    }
    if ( msg.which == 72 ) {
        if (msgDownOrUp == 0) {
            ${27} => oCpSTK.releaseNotes;
        } else if (msgDownOrUp == 1) {
            ${27} => oCpSTK.playNotes;
        }
    }
   
    if ( msg.which == 186 ) {
        if (msgDownOrUp == 0) {
            // <<< "GOT L UP! ", ${33} >>>;
        } else if (msgDownOrUp == 1) {
            // <<< "GOT L DOWN! ", ${33} >>>;
        }
    }





    `;
}
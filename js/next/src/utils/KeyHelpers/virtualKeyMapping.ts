export const virtualKeyMapping = (rootNote: number, msgDownOrUp: number) => {
    
    return `
    ${msgDownOrUp} => int msgDownOrUp;

    
    if ( msg.which == 9 ) {
        if (msgDownOrUp == 0) {
            <<< "TAB UP! ", ${rootNote + 0} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "TAB DOWN! ", ${rootNote + 0} >>>;
        }
    }
    if ( msg.which == 50 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 0 UP!" >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 0 DOWN!" >>>;
        }
    }
    if ( msg.which == 49 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 1 UP! ", ${rootNote + 1} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 1 DOWN! ", ${rootNote + 1} >>>;
        }
    }
    if ( msg.which == 50 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 2 UP! ", ${rootNote + 3} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 2 DOWN! ", ${rootNote + 3} >>>;
        }
    }
    if ( msg.which == 52 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 4 UP! ", ${rootNote + 6} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 4 DOWN! ", ${rootNote + 6} >>>;
        }
    }
    if ( msg.which == 53 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 5 UP! ", ${rootNote + 8} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 5 DOWN! ", ${rootNote + 8} >>>;
        }
    }
    if ( msg.which == 54 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 6 UP! ", ${rootNote + 10} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 6 DOWN! ", ${rootNote + 10} >>>;
        }
    }
    if ( msg.which == 56 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 8 UP! ", ${rootNote + 13} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 8 DOWN! ", ${rootNote + 13} >>>;
        }
    }
    if ( msg.which == 57 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT 9 UP! ", ${rootNote + 15} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT 9 DOWN! ", ${rootNote + 15} >>>;
        }
    }
    if ( msg.which == 81 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT Q UP! ", ${rootNote + 2} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT Q DOWN! ", ${rootNote + 2} >>>;
        }
    }
    if ( msg.which == 87 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT W UP! ", ${rootNote + 4} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT W DOWN! ", ${rootNote + 4} >>>;
        }
    }
    if ( msg.which == 69 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT E UP! ", ${rootNote + 5} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT E DOWN! ", ${rootNote + 5} >>>;
        }
    }
    if ( msg.which == 82 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT R UP! ", ${rootNote + 7} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT R DOWN! ", ${rootNote + 7} >>>;
        }
    }
    if ( msg.which == 84 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT T UP! ", ${rootNote + 9} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT T DOWN! ", ${rootNote + 9} >>>;
        }
    }
    if ( msg.which == 89 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT Y UP! ", ${rootNote + 11} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT Y DOWN! ", ${rootNote + 11} >>>;
        }
    }
    if ( msg.which == 85 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT U UP! ", ${rootNote + 12} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT U DOWN! ", ${rootNote + 12} >>>;
        }
    }
    if ( msg.which == 73 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT I UP! ", ${rootNote + 14} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT I DOWN! ", ${rootNote + 14} >>>;
        }
    }
    if ( msg.which == 79 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT O UP! ", ${rootNote + 16} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT O DOWN! ", ${rootNote + 16} >>>;
        }
    }
    if ( msg.which == 80 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT P UP! ", ${rootNote + 17} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT P DOWN! ", ${rootNote + 17} >>>;
        }
    }
    if ( msg.which == 90 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT Z UP! ", ${rootNote + 19} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT Z DOWN! ", ${rootNote + 19} >>>;
        }
    }
    if ( msg.which == 88 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT X UP! ", ${rootNote + 21} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT X DOWN! ", ${rootNote + 21} >>>;
        }
    }
    if ( msg.which == 67 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT C UP! ", ${rootNote + 23} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT C DOWN! ", ${rootNote + 23} >>>;
        }
    }
    if ( msg.which == 86 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT V UP! ", ${rootNote + 24} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT V DOWN! ", ${rootNote + 24} >>>;
        }
    }
    if ( msg.which == 66 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT B UP! ", ${rootNote + 26} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT B DOWN! ", ${rootNote + 26} >>>;
        }
    }
    if ( msg.which == 78 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT N UP! ", ${rootNote + 28} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT N DOWN! ", ${rootNote + 28} >>>;
        }
    }
    if ( msg.which == 77 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT M UP! ", ${rootNote + 29} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT M DOWN! ", ${rootNote + 29} >>>;
        }
    }
    if ( msg.which == 188 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT , UP! ", ${rootNote + 31} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT , DOWN! ", ${rootNote + 31} >>>;
        }
    }
    if ( msg.which == 190 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT . UP! ", ${rootNote + 33} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT . DOWN! ", ${rootNote + 33} >>>;
        }
    }
    if ( msg.which == 191 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT / UP! ", ${rootNote + 35} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT / DOWN! ", ${rootNote + 35} >>>;
        }
    }
    if ( msg.which == 16 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT Shift UP! ", ${rootNote + 36} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT Shift DOWN! ", ${rootNote + 36} >>>;
        }
    }
    if ( msg.which == 65 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT A UP! ", ${rootNote + 18} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT A DOWN! ", ${rootNote + 18} >>>;
        }
    }
    if ( msg.which == 83 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT S UP! ", ${rootNote + 20} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT S DOWN! ", ${rootNote + 20} >>>;
        }
    }
    if ( msg.which == 68 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT D UP! ", ${rootNote + 22} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT D DOWN! ", ${rootNote + 22} >>>;
        }
    }
    if ( msg.which == 71 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT G UP! ", ${rootNote + 25} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT G DOWN! ", ${rootNote + 25} >>>;
        }
    }
    if ( msg.which == 72 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT H UP! ", ${rootNote + 27} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT H DOWN! ", ${rootNote + 27} >>>;
        }
    }
    if ( msg.which == 75 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT K UP! ", ${rootNote + 30} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT K DOWN! ", ${rootNote + 30} >>>;
        }
    }
    if ( msg.which == 76 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT L UP! ", ${rootNote + 32} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT L DOWN! ", ${rootNote + 32} >>>;
        }
    }
    if ( msg.which == 186 ) {
        if (msgDownOrUp == 0) {
            <<< "GOT ; UP! ", ${rootNote + 34} >>>;
        } else if (msgDownOrUp == 1) {
            <<< "GOT ; DOWN! ", ${rootNote + 34} >>>;
        }
    }
    `
}
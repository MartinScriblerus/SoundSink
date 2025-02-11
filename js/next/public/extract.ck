// input audio file
"oboe_output.wav" => string INPUT;
// me.dir() + "" => string OUTPUT_FILE;
// output file (if empty, will print to console)
// me.dir() + "model.txt" => string OUTPUT_FILE;
me.dir() + "model.txt" => string OUTPUT_FILE;
// // get from arguments
// if( me.args() == 0 ) me.arg(0) => INPUT;
// // get from arguments
// if( me.args() == 1 ) me.arg(1) => OUTPUT_FILE;

<<< me.args() >>>;

// // print usage
// if( me.args() == 0 )
// {
//     <<< "usage: chuck --silent mosaic-extract.ck:INPUT:OUTPUT", "" >>>;
//     <<< " |- INPUT: audio file (.wav), or text file (.txt) listing audio files", "" >>>;
//     <<< " |- OUTPUT: model file (.txt) to contain extracted feature vectors", "" >>>;
//     <<< "EXITING" >>>;
//     me.exit();
// }

// detect; print helpful message
if( Machine.silent() == false )
{
    <<< "-----------------", "" >>>;
    <<< "[mosaic-extract]: chuck is currently running in REAL-TIME mode;", "" >>>;
    <<< "[mosaic-extract]: this step has no audio output; may run faster in SILENT mode!", "" >>>;
    <<< "[mosaic-extract]: to run in SILENT mode, restart chuck with --silent flag", "" >>>;
    <<< "-----------------", "" >>>;
}


//------------------------------------------------------------------------------
// analysis network -- this determines which feature will be extracted
// NOTE: see examples/ai/features for examples of different features
// match the ones in synth
//------------------------------------------------------------------------------
// audio input into a FFT
SndBuf audioFile => FFT fft;
// a thing for collecting multiple features into one vector
FeatureCollector combo => blackhole;
// add spectral feature: Centroid
fft =^ Centroid centroid =^ combo;
// add spectral feature: Flux
fft =^ Flux flux =^ combo;
// add spectral feature: RMS
fft =^ RMS rms =^ combo;
// add spectral feature: MFCC
fft =^ MFCC mfcc =^ combo;
fft =^ RollOff rolloff =^ combo;
fft =^ Chroma chroma =^ combo;
//might suit for guqin
//------------------------------------------------------------------------------
// analysis parameters -- useful for tuning your extraction
//------------------------------------------------------------------------------
// set number of coefficients in MFCC (how many we get out)
20 => mfcc.numCoeffs;
// set number of mel filters in MFCC (internal to MFCC)
10 => mfcc.numFilters;

// do one .upchuck() so FeatureCollector knows how many total dimension
combo.upchuck();
// get number of total feature dimensions
combo.fvals().size() => int NUM_DIMENSIONS;

// set FFT size how many FFT take
//4096 => fft.size;
4410 => fft.size;
// set window type and size
// conditioning number of FFT to analyze
Windowing.hann(fft.size()) => fft.window;
// our hop size (how often to perform analysis)
// how often beats in the system
(fft.size()/2)::samp => dur HOP;
// how many frames to aggregate before averaging?
100 => int NUM_FRAMES;


//------------------------------------------------------------------------------
// OUTPUT: prepare for output
//------------------------------------------------------------------------------
// a feature frame
float featureFrame[NUM_DIMENSIONS];
// how many input files
0 => int NUM_FILES;

// output reference, default is error stream (cherr)
cherr @=> IO @ theOut;
// instantiate
FileIO fout;
// output file
if( OUTPUT_FILE != "" )
{
    // print ** HIT THIS FIRST
    <<< "opening file for output:", OUTPUT_FILE >>>;
    // open
    fout.open( OUTPUT_FILE, FileIO.WRITE );
    // test
    if( !fout.good() )
    {
        <<< " |- cannot open file for writing...", "" >>>;
        me.exit();
    }
    // override
    fout @=> theOut;
}


//------------------------------------------------------------------------------
// INPUT: prepare for iterating over input data and extract features
//------------------------------------------------------------------------------

// array input audio files
string filenames[0];
// parse INPUT, which may be an audio file (.wav) or a list of filenames (.txt)
if( !parseInput( INPUT, filenames ) ) me.exit();

// loop over filenname
for( int i; i < filenames.size(); i++)
{
    // extract the file
    if( !extractTrajectory( me.dir()+filenames[i], filenames[i], i, theOut ) )
    {
        // issue warning
        cherr <= "[mosaic-extract]: problem extracting (and skipping): " <= filenames[i] <= IO.newline();
        // skip
        continue;
    }
}

// flush output
theOut.flush();
// close
theOut.close();


//------------------------------------------------------------------------------
// extractTrajectory() -- extracts and outputs feature vectors from a single file
//------------------------------------------------------------------------------
fun int extractTrajectory( string inputFilePath, string shortName, int fileIndex, IO out )
{    
    // increment
    NUM_FILES++;
    // log *** HIT THIS SECOND!!!
    cherr <= "[" <= NUM_FILES <= "] extracting features: " <= inputFilePath <= IO.newline();
    
    // load by block to speed up IO
    fft.size() => audioFile.chunks;
    // read the audio file
    inputFilePath => audioFile.read;
    // file position (in seconds)
    int pos;
    // frame index
    int index;
    
    while( audioFile.pos() < audioFile.samples() )
    {
        // remember the starting pos of each vector
        audioFile.pos() => int pos;
        // let one FFT-size of time pass (to buffer)
        fft.size()::samp => now;
        // zero out
        featureFrame.zero();
        // loop over frames
        for( int i; i < NUM_FRAMES; i++ )
        {
            //-------------------------------------------------------------
            // a single upchuck() will trigger analysis on everything
            // connected upstream from combo via the upchuck operator (=^)
            // the total number of output dimensions is the sum of
            // dimensions of all the connected unit analyzers
            //-------------------------------------------------------------
            combo.upchuck();
            // for each dimension
            for( int d; d < NUM_DIMENSIONS; d++ )
            {
                // copy
                combo.fval(d) +=> featureFrame[d];
            }
            // advance time
            HOP => now;
        }
        
        // print label name and endline
        out <= shortName <= " " <= (pos::samp)/second <= " ";

        //-------------------------------------------------------------
        // average into a single feature vector per file
        // NOTE: this can be easily modified to N feature vectors
        // spread out over the length of an audio file; for now
        // we will just do one feature vector per file
        //-------------------------------------------------------------
        for( int d; d < NUM_DIMENSIONS; d++ )
        {
            // average by total number of frames
            NUM_FRAMES /=> featureFrame[d];
            // print the MFCC results
            out <= featureFrame[d] <= " ";
        }
        
        out <= IO.newline();
        <<< "OUT: ", out >>>; // out read frames into hash(?)
        // print .
        if( out != cherr ) { cherr <= "."; cherr.flush(); }
        
        // increment index
        index++;
    }
    
    // print newline to screen
    if( out != cherr ) cherr <= IO.newline();

    // done
    return true;
}


//------------------------------------------------------------------------------
// parse INPUT argument -- either single audio file or a text file containing a list
//------------------------------------------------------------------------------
fun int parseInput( string input, string results[] )
{
    // clear results
    results.clear();
    // see if input is a file name
    if( input.rfind( ".wav" ) > 0 || input.rfind( ".aiff" ) > 0 )
    {
        // make new string (since << current appends by reference)
        input => string sss;
        // append
        results << sss;
    }
    else
    {
        // load data
        FileIO fio;
        if( !fio.open( me.dir() + input, FileIO.READ ) )
        {
            // error
            <<< "cannot open file:", me.dir() + input >>>;
            // close
            fio.close();
            // return done
            return false;
        }
        
        // read each filename
        while( fio.more() )
        {
            // read each line
            fio.readLine().trim() => string line;
            <<< "LINE: ", line >>>;
            // if not empty
            if( line != "" )
            {
                results << line;
            }
        }
    }
    
    return true;
}
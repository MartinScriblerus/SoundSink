import Image from 'next/image'
import styles from './page.module.css'
import InitializationStyle from './components/InitializationStyle'
import { CssBaseline } from '@mui/material'


export default function Home() {

  // const [chuckHook, setChuckHook] = useState<Chuck | undefined>(undefined);
  // const aChuck = useDeferredValue(chuckHook)

  // const initChuck = async() => {
  
  //   const serverFilesToPreload = [
  //     {
  //       serverFilename: '/static/vocoder.ck',
  //       virtualFilename: 'static/vocoder.ck'
  //     },
  //   ]
  //   // Create the default ChucK object
  //   const theChuck = await Chuck.init(serverFilesToPreload, undefined, 2);
  //   console.log("The Chuck: ", theChuck);

  //   try {
  //     if (theChuck) {
  //       setChuckHook(theChuck);
  //     } else {
  //       return;
  //     }
  //   } catch (e: any) {
  //     console.log('failed to pass theChuck into theChuckHook', e);
  //   }

  //   if (theChuck.context.state === "suspended") {
  //     const theChuckContext: any = theChuck.context;
  //     theChuckContext.resume();
  //   }

  //   try {
  //     await theChuck.runCode(`
  //       adc => Gain g => dac;
  //       0.03 => g.gain;
  //       while( true ) { 100::ms => now; }
  //     `);
  //   } catch (e) {
  //     console.log('err: ', e);
  //   }

  //   const fau: any = await fetch('/chugin/Faust.chug/Contents/MacOS/Faust');
  //   console.log('OYYY ', fau)
  //   await theChuck.loadChugin('/chugin/Faust.chug/Contents/MacOS/Faust');
  //   console.log('ummmmm..... ', theChuck.loadedChugins());
  //   // try {
  //   // console.log(theChuck.loadedChugins())
  //   // console.log('FC ', faustChug);
  //   // } catch (e) {
  //   //   console.log('what is err: ', e)
  //   // }

  //   // Run ChucK code
  // };

  // const chuckMicButton = function ()
  // {
  //     navigator.mediaDevices
  //         .getUserMedia({
  //             video: false,
  //             audio: {
  //                 echoCancellation: false,
  //                 autoGainControl: false,
  //                 noiseSuppression: false,
  //             },
  //         })
  //         .then(async (stream: MediaStream) => {
  //             const audioDestinationNode: any = await aChuck?.context;
  //             console.log('wtf stream: ', stream);
  //             try {
  //               const adc: AudioDestinationNode = AudioDestinationNode ? audioDestinationNode?.createMediaStreamSource(stream) : null;
  //               console.log('er adc? ', adc);
  //               console.log('er stream ', stream);


  //               const connectorFun = (destinationNode: AudioDestinationNode, outputNum: number | undefined, inputNum: number | undefined) => {
  //                 if (destinationNode instanceof Chuck) {
  //                             try {
  //                               return adc && (adc.connect(destinationNode, inputNum, outputNum));
  //                             } catch (e: any) {
  //                               console.log('could not access adc: ', e);
  //                             }
  //                 };
  //               };
  //               connectorFun(adc, 1, 1);
  //             } catch (e) {
  //               console.log(e);
  //             }
  //           })
          
  //     const micButton: any = document.querySelector(`#micButton`)
  //     micButton && (
  //     micButton.disabled = true)
  // };
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>
        <InitializationStyle />
        <a
          href="#"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Initialize <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}


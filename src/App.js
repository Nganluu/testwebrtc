import logo from './logo.svg';
import './App.css';

function App() {
  const constraints = (window.constraints = {
    audio: false,
    video: true,
  });

  function handleSuccess(stream) {
    const video = document.querySelector("video");
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
    video.play();
  }
  
  const errorMsg= (msg, error) => {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  function handleError(error) {
    if (error.name === "OverconstrainedError") {
      const v = constraints.video;
      errorMsg(
        `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
      );
    } else if (error.name === "NotAllowedError") {
      errorMsg(
        "Permissions have not been granted to use your camera and " +
          "microphone, you need to allow the page access to your devices in " +
          "order for the demo to work."
      );
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  const init = async (e) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div id="container">
      <h1>
        <a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">
          WebRTC samples
        </a>
        <span>getUserMedia</span>
      </h1>

      <video id="gum-local" autoPlay playsInline />
      <button onClick={()=>init()} id="showVideo">Open camera</button>

      <div id="errorMsg"></div>

      <p>
        Display the video stream from <code>getUserMedia()</code> in a video
        element.
      </p>

      <p>
        The <code>MediaStream</code> object <code>stream</code> passed to the{" "}
        <code>getUserMedia()</code> callback is in global scope, so you can
        inspect it from the console.
      </p>
    </div>
  );
}

export default App;

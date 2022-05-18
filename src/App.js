import logo from "./logo.svg";
import "./App.css";
import adapter from "webrtc-adapter";
import ZJSBridge from "zalo-js-bridge";
import platform from "platform";

function App() {
  const constraints = (window.constraints = {
    audio: false,
    video: true,
  });

  function handleSuccess(stream) {
    const video = document.querySelector("video");
    video.muted = true;
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
    var test = video.cloneNode();
    console.log("browser: ", adapter.browserDetails);
    console.log(video.muted, " ", video.autoplay, " ", video.playsInline);

    throw new Error(test.outerHTML);

    // video.autoplay = true;
    // video.muted = true;
    // video.loop = true;
    // video.play();
  }

  const errorMsg = (msg, error) => {
    const errorElement = document.querySelector("#errorMsg");
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== "undefined") {
      console.error(error);
      throw Error(error.toString());
    }
  };

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
      let url = window.location.href;
      ZJSBridge.Zalo.openOutApp(url, (e) => {
        // alert(JSON.stringify(e));
      });
      ZJSBridge.H5.closeWebview((e) => {
        // alert(JSON.stringify(e));
      });
      const video = document.querySelector("video");
      var test = video.cloneNode();
      console.log("video ", test.outerHTML);
      handleSuccess(stream);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div id="container">
      <button
        style={{ backgroundColor: "blue" }}
        className="me-5"
        onClick={() => {
          if (platform.os.family.includes("iOS")) {
            let url = window.location.href;
            ZJSBridge.Zalo.openOutApp(url, (e) => {
              // alert(JSON.stringify(e));
            });
          }
        }}
      >
        open gg
      </button>
      <button
        className="ms-5 top-0 start-0"
        style={{ position: "absolute", zIndex: "1000" }}
        onClick={() => {
          let url = window.location.href;
          ZJSBridge.Zalo.openOutApp(url, (e) => {
            // alert(JSON.stringify(e));
          });
          ZJSBridge.H5.closeWebview((e) => {
            // alert(JSON.stringify(e));
          });
        }}
      >
        close
      </button>
      <h1>
        <a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">
          WebRTC samples 1.4
        </a>
        <span>getUserMedia</span>
      </h1>

      <video
        id="gum-local"
        muted={true}
        autoPlay
        playsInline
        style={{ WebkitPlaysInline: true }}
      ></video>
      <button onClick={() => init()} id="showVideo">
        Open camera
      </button>

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

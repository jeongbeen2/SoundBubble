import React, { useState } from "react";
import { PitchDetector } from "pitchy";
import "../Styles/Record.css";

let recoding = null;

function Record() {
  const [audio, setAudio] = useState(null);
  const [pitch, setPitch] = useState("");
  const [clarity, setClarity] = useState("");

  async function getMicrophone() {
    console.log("start!");
    // 미디어 입력 장치 사용 권한 요청
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setAudio(audio);

    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    //* pitchy
    let sourceNode = audioContext.createMediaStreamSource(audio);
    sourceNode.connect(analyserNode);
    const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
    const input = new Float32Array(detector.inputLength);
    updatePitch(analyserNode, detector, input, audioContext.sampleRate);
  }

  function stopMicrophone() {
    if (audio) {
      console.log("stop!");
      audio.getTracks().forEach((track) => track.stop());
      setAudio(null);
    }
    clearTimeout(recoding);
  }

  function toggleMicrophone() {
    if (audio) stopMicrophone();
    else getMicrophone();
  }

  function updatePitch(analyserNode, detector, input, sampleRate) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    const clarityPercent = Math.round(clarity * 100);
    if (clarityPercent >= 80) {
      // 80% 정확도인 피치만 출력
      setPitch(Math.round(pitch * 10) / 10);
      setClarity(Math.round(clarity * 100));
    }

    recoding = setTimeout(
      () => updatePitch(analyserNode, detector, input, sampleRate),
      100
    );
  }

  // console.log(pitch, clarity);
  return (
    <div className="get-color-box">
      <button
        className="audio-btn"
        onClick={toggleMicrophone}
        style={{
          background: `hsl(540, 100%, ${pitch > 260 ? "85%" : "40%"})`,
        }}
      ></button>
      <h1></h1>
      <h2>
        {audio
          ? "원을 한번 더 누르면 종료됩니다."
          : "원을 클릭하면 시작합니다."}
      </h2>
      <div className="message">피치 : {pitch} Hz</div>
      <div className="message">정확도 : {clarity} %</div>
    </div>
  );
}

export default Record;

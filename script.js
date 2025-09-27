let recognition;
let transcriptText = "";

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    document.getElementById("output").innerHTML = "<em>Listening...</em>";
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcriptText += event.results[i][0].transcript + " ";
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    document.getElementById("output").innerHTML =
      transcriptText + "<i>" + interimTranscript + "</i>";
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
} else {
  alert("Your browser does not support Speech Recognition. Use Google Chrome!");
}

document.getElementById("startBtn").addEventListener("click", () => {
  transcriptText = "";
  recognition.start();
});

document.getElementById("stopBtn").addEventListener("click", () => {
  recognition.stop();
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  if (!transcriptText.trim()) {
    alert("Nothing to save!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: transcriptText.trim() }),
    });

    if (res.ok) {
      alert("Transcript saved to database!");
      transcriptText = "";
      document.getElementById("output").innerHTML = "";
    } else {
      alert("Error saving transcript!");
    }
  } catch (err) {
    console.error(err);
    alert("Server not running?");
  }
});

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString().trim(),
  });

  return result;
}

document.addEventListener("DOMContentLoaded", async () => {
  const selectedText = await getSelectedText();

  const wordElement = document.getElementById("word");
  const meaningElement = document.getElementById("meaning");

  if (!selectedText) {
    wordElement.innerText = "No text selected";
    meaningElement.innerText = "Please select a word or phrase.";
    return;
  }

  const words = selectedText.split(/\s+/); // split by spaces

  wordElement.innerText = selectedText;

  meaningElement.innerHTML = "Fetching meanings...";

  let output = "";

  for (const word of words) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await res.json();

      const definition = data[0]?.meanings[0]?.definitions[0]?.definition;

      output += `<div style="margin-bottom: 12px;">
        <strong style="color:#1e293b;">${word}:</strong><br/>
        <span style="color:#475569;">${
          definition || "No definition found."
        }</span>
      </div>`;
    } catch (err) {
      output += `<div><strong>${word}:</strong> Error fetching meaning.</div>`;
    }
  }

  meaningElement.innerHTML = output;
});

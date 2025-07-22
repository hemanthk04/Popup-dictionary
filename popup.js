async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString().trim(),
  });

  return result;
}

document.addEventListener("DOMContentLoaded", async () => {
  const word = await getSelectedText();

  const wordElement = document.getElementById("word");
  const meaningElement = document.getElementById("meaning");

  if (!word) {
    wordElement.innerText = "No word selected";
    meaningElement.innerText = "Please select a word on the page.";
    return;
  }

  wordElement.innerText = word;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await res.json();

    const definition = data[0]?.meanings[0]?.definitions[0]?.definition;
    meaningElement.innerText = definition || "No definition found.";
  } catch (err) {
    meaningElement.innerText = "Failed to fetch meaning.";
  }
});

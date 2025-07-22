chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupDefinition",
    title: "Get Meaning of '%s'",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupDefinition") {
    const selectedText = info.selectionText;
    chrome.storage.local.set({ selectedWord: selectedText }, () => {
      chrome.action.openPopup();
    });
  }
});

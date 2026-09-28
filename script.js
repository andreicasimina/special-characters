const characterGrid = document.querySelector("#characters");
const status = document.querySelector("#status");

loadCharacters();

async function loadCharacters() {
  try {
    const response = await fetch("characters.txt");
    if (!response.ok) throw new Error("characters.txt could not be loaded");

    const fileContents = await response.text();
    const characters = fileContents.split(/\r?\n/);
    // Ignore the empty line created by the usual final newline at the end of a file.
    if (characters.at(-1) === "") characters.pop();

    if (characters.length === 0) {
      status.textContent = "characters.txt に文字を追加してください。";
      return;
    }

    renderCharacters(characters);
  } catch {
    status.textContent = "characters.txt を読み込めませんでした。GitHub Pages 上で開いているか確認してください。";
  }
}

function renderCharacters(characters) {
  characters.forEach((character) => {
    const button = document.createElement("button");
    button.className = "character-button";
    button.type = "button";
    const characterName = getCharacterName(character);
    const label = document.createElement("span");
    label.className = "character-label";
    label.textContent = getButtonLabel(character);
    button.append(label);
    button.classList.toggle("whitespace", /\s/.test(character));
    button.setAttribute("aria-label", `${characterName}をコピー`);
    button.title = `${characterName}をコピー`;
    button.addEventListener("click", () => copyCharacter(character, button));
    characterGrid.append(button);
  });

  fitButtonLabels();
}

function fitButtonLabels() {
  document.querySelectorAll(".character-button").forEach((button) => {
    const label = button.querySelector(".character-label");
    const availableWidth = button.clientWidth - 20;
    const maximumSize = button.classList.contains("whitespace") ? 12 : 42;

    label.style.fontSize = `${maximumSize}px`;
    const renderedWidth = label.scrollWidth;
    const fittedSize = renderedWidth > availableWidth
      ? maximumSize * (availableWidth / renderedWidth)
      : maximumSize;

    label.style.fontSize = `${Math.max(1, fittedSize)}px`;
  });
}

new ResizeObserver(fitButtonLabels).observe(characterGrid);

function getButtonLabel(character) {
  if (character === " ") return "半角スペース";
  if (character === "　") return "全角スペース";
  if (character === "") return "空の行";
  return character;
}

function getCharacterName(character) {
  if (character === " ") return "半角スペース";
  if (character === "　") return "全角スペース";
  if (character === "") return "空の行";
  return character;
}

async function copyCharacter(character, button) {
  try {
    await navigator.clipboard.writeText(character);
  } catch {
    // Supports older browsers and pages served without HTTPS.
    const helper = document.createElement("textarea");
    helper.value = character;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  status.textContent = `${getCharacterName(character)}をクリップボードにコピーしました。`;
  button.classList.add("copied");
  window.setTimeout(() => button.classList.remove("copied"), 700);
}

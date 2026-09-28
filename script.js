// Edit this value to choose the characters shown on the site.
// Each character becomes its own copy button, including normal and full-width spaces.
const CHARACTERS = "あゃｱｧアァ1１AaＡａ田仝々ﾞﾟ¥｢｣()/ｰ,. ･#$+-:?@[]^_|%*={}~゛゜￥「」()／ー―‐－，．　ヽヾゝゞ〃〆・＃＄＋：？＠［］＾＿｜％＊＝｛｝～、。０";

const characterGrid = document.querySelector("#characters");
const status = document.querySelector("#status");

const characters = Array.from(CHARACTERS);

if (characters.length === 0) {
  status.textContent = "Add characters to CHARACTERS in script.js.";
} else {
  characters.forEach((character) => {
    const button = document.createElement("button");
    button.className = "character-button";
    button.type = "button";
    const characterName = getCharacterName(character);
    button.textContent = getButtonLabel(character);
    button.classList.toggle("whitespace", /\s/.test(character));
    button.setAttribute("aria-label", `Copy ${characterName}`);
    button.title = `Copy ${characterName}`;
    button.addEventListener("click", () => copyCharacter(character, button));
    characterGrid.append(button);
  });
}

function getButtonLabel(character) {
  if (character === " ") return "半角スペース";
  if (character === "　") return "全角スペース";
  return character;
}

function getCharacterName(character) {
  if (character === " ") return "半角スペース";
  if (character === "　") return "全角スペース";
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

  status.textContent = `Copied ${getCharacterName(character)} to your clipboard.`;
  button.classList.add("copied");
  window.setTimeout(() => button.classList.remove("copied"), 700);
}

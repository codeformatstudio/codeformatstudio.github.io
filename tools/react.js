// ---------- CSS → RN converter ----------
function cssToRN(css) {
  return Object.fromEntries(
    css
      .split(";")
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => {
        let [p, v] = r.split(":").map((s) => s.trim());
        p = p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (v.endsWith("px")) v = parseFloat(v);
        else if (!isNaN(v)) v = parseFloat(v);
        return [p, v];
      })
  );
}

// ---------- CodeMirror ----------
const input = CodeMirror(document.getElementById("input"), {
  mode: "xml",
  theme: "dracula",
  lineNumbers: true,
  value: `<!DOCTYPE html>
<html>
<head>
<title>Hello RN</title>
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>
</head>
<body style="background:#222;">
  <div style="padding:20px;">
    <h1>Hello RN Converter</h1>
  </div>
  <div style="margin:12px;">
    <p style="font-size:18px;color:#ff0;">Full HTML supported!</p>
    <img src="https://picsum.photos/300" style="width:200px;height:120px;" />
    <ul><li>Bullet One</li><li>Two</li></ul>
    <a href="https://example.com">Link</a>
  </div>
</body>
</html>`,
});

const output = CodeMirror(document.getElementById("output"), {
  mode: "javascript",
  theme: "dracula",
  lineNumbers: true,
  readOnly: true,
});

// ---------- Tag mapping React → React Native ----------
const tagMap = {
  div: "View",
  section: "View",
  article: "View",
  header: "View",
  footer: "View",
  nav: "View",
  ul: "View",
  ol: "View",
  li: "Text",
  p: "Text",
  span: "Text",
  a: "Text",
  h1: "Text",
  h2: "Text",
  h3: "Text",
  h4: "Text",
  h5: "Text",
  h6: "Text",
  img: "Image",
  button: "TouchableOpacity",
  input: "TextInput",
  textarea: "TextInput",
};

let styleCounter = 0;
let styleMap = {};

// ---------- Convert HTML DOM Node → RN JSX ----------
function convertNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent.trim();
    return t ? `<Text>${t}</Text>` : "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  let tag = tagMap[node.tagName.toLowerCase()] || "View";

  let styleProp = "";
  if (node.style && node.style.cssText) {
    const styleObj = cssToRN(node.style.cssText);
    if (Object.keys(styleObj).length) {
      const name = "s" + styleCounter++;
      styleMap[name] = styleObj;
      styleProp = ` style={styles.${name}}`;
    }
  }

  let props = "";
  if (tag === "Image" && node.src) props = ` source={{uri:"${node.src}"}}`;
  if (tag === "TextInput" && node.placeholder)
    props = ` placeholder="${node.placeholder}"`;
  if (tag === "Text" && node.tagName.toLowerCase() === "a" && node.href)
    props = ` onPress={()=>Linking.openURL("${node.href}")}`;

  const children = Array.from(node.childNodes).map(convertNode).join("");
  if (!children && ["Image", "TextInput"].includes(tag))
    return `<${tag}${props}${styleProp} />`;

  return `<${tag}${props}${styleProp}>${children}</${tag}>`;
}

// ---------- Main conversion ----------
function convert() {
  styleCounter = 0;
  styleMap = {};

  const html = input.getValue();

  // Step 1: HTML → React JSX via html-to-jsx
  const converter = new HTMLtoJSX({ createClass: false });
  const reactJSX = converter.convert(html);

  // Step 2: Parse React JSX string → DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Detect external CSS/JS
  const links = Array.from(doc.querySelectorAll("link[href]")).map(
    (l) => l.href
  );
  const scripts = Array.from(doc.querySelectorAll("script[src]")).map(
    (s) => s.src
  );

  // Step 3: Map DOM nodes → RN JSX
  const jsxBody = Array.from(doc.body.childNodes).map(convertNode).join("\n");

  let styleCode = "const styles = StyleSheet.create({\n";
  for (const k in styleMap) {
    styleCode += `  ${k}: ${JSON.stringify(styleMap[k], null, 2)},\n`;
  }
  styleCode += "});";

  output.setValue(
    `// External CSS: ${links.join(", ") || "none"}
// External JS : ${scripts.join(", ") || "none"}

import { View,Text,Image,TouchableOpacity,TextInput,ScrollView,StyleSheet,Linking } from "react-native";

export default function App(){
  return(
    <ScrollView>
${jsxBody}
    </ScrollView>
  );
}

${styleCode}`
  );
}

input.on("change", convert);
convert();
window.copyOutput = () => navigator.clipboard.writeText(output.getValue());

// HTML validation for every page (html-validate, recommended rules).
import { HtmlValidate, formatterFactory } from "html-validate";
const files = ["index.html", "lab/index.html", "elements/index.html", "404.html", "privacy/index.html"];
const hv = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "no-inline-style": "off",          // a few computed custom properties (--i, --ratio) are set inline
    "long-title": "off",
    "no-trailing-whitespace": "off",
    "attribute-boolean-style": "off",
    "void-style": "off",
    "doctype-style": "off",             // lowercase doctype is valid HTML
    "no-redundant-role": "off",         // role="list" restores list semantics in Safari when list-style is none
    "prefer-native-element": ["error", { exclude: ["region"] }],
  },
});
let errors = 0;
const text = formatterFactory("text");
for (const f of files) {
  const report = await hv.validateFile(f);
  errors += report.errorCount;
  if (!report.valid) console.log(text(report.results));
  else console.log(`valid  ${f}`);
}
process.exit(errors ? 1 : 0);

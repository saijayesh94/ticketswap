import { PdfReader } from "pdfreader";

new PdfReader().parseFileItems("ticket.pdf", (err, item) => {
  if (err) console.error("error:", err);
  else if (!item) console.warn("end of file");
  else if (item.text) console.log(item.text);
});
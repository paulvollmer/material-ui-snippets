const fs = require("fs");
const path = require("path");

fs.readdir("./material-ui/pages/api/", function(err, files) {
  if (err) {
    throw new Error(err);
    process.exit(1);
  }

  let importSnippet = [
    "# coffeelint: disable=max_line_length",
    "",
    "# GENERATED FILE, DO NOT EDIT",
    "",
    "'.source.js':"
  ];

  for (let i = 0; i < /*files.length*/ 20; i++) {
    if (path.extname(files[i]) === ".md") {
      // console.log(files[i].replace(".md", ""));
      const md = fs.readFileSync("./material-ui/pages/api/" + files[i], "utf8");

      var reDesc = "<p class=.description.[^>]*>(.*?)<s*/s*p>";
      const description = md.match(reDesc);
      // console.log("description ----", description[1]);

      var reImport = "import .* from '.*';";
      const imp = md.match(reImport);
      const tmpImp = imp + "";
      const impSplitted = tmpImp.split(" ");
      // console.log("import ----", imp[0]);
      // console.log("");

      importSnippet.push(`  "${imp}":`);
      importSnippet.push(`    'prefix': 'import ${impSplitted[1]}'`);
      importSnippet.push(`    'body': "${imp}\\n$1"`);
      importSnippet.push(`    'description': "${description[1]}"`);
      importSnippet.push(`    'descriptionMoreURL': "https://material-ui.com/api/${files[i].replace(".md", "")}/"`);
      importSnippet.push(``);
    }
  }

  // console.log(importSnippet.join("\n"));
  fs.writeFileSync('./snippets/imports.cson', importSnippet.join("\n"))
});

var formations = {};
var formation = {
 name: "",
 positions: [],
 exportcode: "",
 getFormations: function()
 {
  formations = [];
  remote.getHTMLDocument("/formacion2.php", this.parseFormations);
 },
 parseFormations: function(doc)
 {
  var results = doc.evaluate("//a[starts-with(@href,'formacion2.php?id_formacion')]", doc, null,
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for(var i = 0; i < results.snapshotLength; i++) {
   var match = results.snapshotItem(i).href.match(/formacion2\.php\?id_formacion=([0-9]+)/);
   if (match) {
    formations[results.snapshotItem(i).firstChild.nodeValue] = match[1];
   }
  }
  advtactic.setFormations(formations);
  storage.getMe('tactics');
 }
};
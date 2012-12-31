var formations = {};
var formation = {
 name: "",
 positions: [],
 exportcode: "",
 getFormations: function()
 {
  formations = [];
  remote.getHTMLDocument("http://en3.strikermanager.com/formacion2.php", this.parseFormations);
 },
 parseFormations: function(doc)
 {
  var results = doc.getElementsByTagName("a");
  for (var i = 0; i < results.length; i++) {
   var match = results[i].href.match(/formacion2\.php\?id_formacion=([0-9]+)/);
   if (match) {
    formations[results[i].firstChild.nodeValue] = match[1];
   }
  }
  advtactic.setFormations(formations);
  storage.getMe('tactics');
 }
};
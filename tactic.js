var tactics = {};
var tactic = {
 class: "tactic",
 name: "",
 red: 0,
 yellow: 0,
 green: 0,
 effort: 0,
 attack: 0,
 defense: 0,
 play: 0,
 getTactics: function()
 {
  tactics = {};
  remote.getHTMLDocument("/tactica2.php", this.parseTactics);
 },
 parseTactics: function(doc)
 {
  for (var me in {"1":1, "2":2}) {
   var things = doc.getElementsByClassName("tipo" + me);
   for (var i = 0; i < things.length; i++) {
    var a = things[i].firstChild.nextSibling.firstChild.nextSibling;
    tactics[a.firstChild.nodeValue] = a.attributes[0].nodeValue.match(/id_tactica=([0-9]+)/)[1];
   }
  }
  advtactic.setTactics(tactics);
  storage.getMe('tactics');
 }
};
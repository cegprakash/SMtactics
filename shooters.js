var shooters = {
 class: "shooters",
 freekick: "",
 penalties: "",
 corners: "",
 captain: "",
 tactic: "",
 toStruct: function()
 {
  return {
   class: "shooters",
   freekick: this.freekick,
   penalties: this.penalties,
   corners: this.corners,
   captain: this.captain,
   tactic: this.tactic
  };
 },
 fromStruct: function(struc)
 {
  this.freekick = struc.freekick;
  this.penalties = struc.penalties;
  this.corners = struc.corners;
  this.captain = struc.captain;
  this.tactic = struc.tactic;
 },
 getShooters: function()
 {
  var self = this;
  remote.get("http://en3.strikermanager.com/tactica.php", "", function(response) {
   var doc = document.implementation.createHTMLDocument("stuff");
   doc.documentElement.innerHTML = response;
   self.tactic = response.match(/<a href="tactica2.php\?id_tactica=(\d+)">[^<]+<\/a>\s+<\/td>\s+<td style="width:30%;" class="centrado2">\s+Active/);
   this.freekick = doc.frm.falta.value;
   this.penalties = doc.frm.penalti.value;
   this.corners = doc.frm.corner.value;
   this.captain = doc.frm.capitan.value;
   storage.getMe("shooters");
  });
 },
 setShooters: function(callback)
 {
  remote.get("http://en3.strikermanager.com/tactica.php", {id_tactica: this.tactic}, callback);
  remote.post("http://en3.strikermanager.com/tactica.php",
              {falta: this.freekick, penalti: this.penalties, corner: this.corners, capitan: this.captain},
              callback);
 }
}
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
  remote.get("/tactica.php", "", function(response) {
   var doc = document.implementation.createHTMLDocument("stuff");
   doc.documentElement.innerHTML = response;
   self.tactic = response.match(/<a href="tactica2.php\?id_tactica=(\d+)">[^<]+<\/a>\s+<\/td>\s+<td style="width:30%;" class="centrado2">\s+Active/)[1];
   var frm = doc.forms.frm;
   self.freekick = frm.falta.value;
   self.penalties = frm.penalti.value;
   self.corners = frm.corner.value;
   self.captain = frm.capitan.value;
   storage.getMe("shooters");
  });
 },
 setShooters: function(callback)
 {
  remote.get("/tactica.php", {id_tactica: this.tactic}, callback);
  remote.post("/tactica.php",
              {falta: this.freekick, penalti: this.penalties, corner: this.corners, capitan: this.captain},
              callback);
 }
}
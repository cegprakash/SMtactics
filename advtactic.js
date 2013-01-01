var advtactics = [], advtest = {};
var advtactic = {
 class: "advtactic",
 minute: "",
 status: "",
 formation: "",
 tactic: "",
 subs: {
  out: [],
  in: []
 },
 formdata: ["minute", "status", "formation", "tactic"],
 formations: {},
 formtranslate: {
  minute: {
   name: "tiempo_juego",
   values: {
    "Any time": 0,
    "Beginning first half": 1,
    "Beginning the second half": 2,
    "15th minute": 15,
    "30th minute": 30,
    "60th minute": 60,
    "75th minute": 75
   },
  },
  status: {
   name: "situacion_partido",
   values: {
    "Any": 0,
    "Draw": 1,
    "1 goal ahead": 2,
    "2 goals ahead": 3,
    "More than two goals lead": 4,
    "1 goal down": 5,
    "More than one goal down": 6
   }
  },
  formation: {
   name: "formacion",
   values: {}
  },
  tactic: {
   name: "tactica",
   values: {}
  }
 },
 setTactics: function(tactics) {
  this.formtranslate.tactic.values = tactics;
 },
 setFormations: function(formations) {
  this.formtranslate.formation.values = formations;
 },
 fromStruct: function(struct)
 {
  this.minute = struct.minute;
  this.status = struct.status;
  this.formation = struct.formation;
  this.tactic = struct.tactic;
  this.subs = struct.subs;
  return this;
 },
 clone: function()
 {
  var ret = {};
  for (var i in this) {
   ret[i] = this[i];
  }
  return ret;
 },
 fromArray: function(arr)
 {
  advtactics = [];
  for (var i = 0; i < arr.length; i++) {
   var temp = this.clone();
   advtactics[i] = temp.fromStruct(arr[i]);
  }
 },
 toStruct: function(struct)
 {
  return {
   class: "advtactic",
   minute: this.minute,
   status: this.status,
   formation: this.formation,
   tactic: this.tactic,
   subs: this.subs
  };
 },
 getIds: function(src) {
  if (!src) {
   src = document.getElementsByClassName('bframe').innerHTML;
  }
  var matches = src.match(/edit_tactica\.php\?accion=borrar&id=(\d+)/g);
  var ret = [];
  for (var i = 0; i < matches.length; i++) {
   ret.push(matches[i].match(/edit_tactica\.php\?accion=borrar&id=(\d+)/)[1]);
  }
  return ret;
 },
 getEditURLS: function(src) {
  var ids = this.getIds(src);
  var ret = [];
  for (var i = 0; i < ids.length; i++) {
   ret.push("http://en3.strikermanager.com/edit_tactica.php?id=" + ids[i]);
  }
  return ret;
 },
 getDeleteURLS: function(src) {
  var ids = this.getIds(src);
  var ret = [];
  for (var i = 0; i < ids.length; i++) {
   ret.push("http://en3.strikermanager.com/edit_tactica.php?accion=borrar&id=" + ids[i]);
  }
  return ret;
 },
 getFormValues: function(doc) {
  if (!doc) {
   doc = document;
  }
  var frm = doc.forms.frm;
  this.minute = frm.tiempo_juego.value;
  this.status = frm.situacion_partido.value;
  this.formation = frm.formacion.value;
  this.tactic = frm.tactica.value;
  // subs in jugador, out suplente
  this.subs.in[1] = frm.jugador1.value;
  this.subs.in[2] = frm.jugador2.value;
  this.subs.in[3] = frm.jugador3.value;
  this.subs.out[1] = frm.suplente1.value;
  this.subs.out[2] = frm.suplente2.value;
  this.subs.out[3] = frm.suplente3.value;
 },
 getFormData: function() {
  var ret = {};
  for (var i = 0; i < this.formdata.length; i++) {
   ret[this.formdata[i]] = this[this.formdata[i]];
  }
  ret['jugador1'] = this.subs.in[1];
  ret['jugador2'] = this.subs.in[2];
  ret['jugador3'] = this.subs.in[3];
  ret['suplente1'] = this.subs.out[1];
  ret['suplente2'] = this.subs.out[2];
  ret['suplente3'] = this.subs.out[3];
  return ret
 },
 submitForm: function(callback) {
  remote.post("http://en3.strikermanager.com/edit_tactica.php", this.getFormData(), callback);
 },
 getAdvancedTactics: function() {
  self = this;
  remote.get("http://en3.strikermanager.com/tactica_avanzada.php", "", function(response) {
   var urls = self.getEditURLS(response);
   storage.getMe(['advtacticcount', urls.length]);
   advtactics = [];
   for (var i = 0; i < urls.length; i++) {
    var guy = {};
    for (var dup in self) {
     guy[dup ] = self[dup];
    }
    remote.getHTMLDocument(urls[i], function (doc) {
     guy.getFormValues(doc);
     if (advtest[guy.minute]) return;
     advtest[guy.minute] = true;
     advtactics.push(guy);
     storage.getMe('advtactic');
    });
   }
  });
 },
 setAdvancedTactics: function(callback) {
  self = this;
  remote.get("http://en3.strikermanager.com/tactica_avanzada.php", "", function(response) {
   var urls = self.getDeleteURLS(response);
   var done = 0;
   var counter2 = function(response) {
    done++;
    if (done == advtactics.length) {
     if (callback) {
      callback();
     }
    }
   }
   var counter = function(response) {
    done++;
    if (done == durls.length) {
     done = 0;
     for (var i = 0; i < advtactics.length; i++) {
      advtactics[i].submitForm(counter2);
     }
    }
   }
   for (var i = 0; i < durls.length; i++) {
    remote.get(durls[i], "", counter);
   }
  });
 }
};
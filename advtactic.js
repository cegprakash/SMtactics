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
 fromStruct: function(self, struct)
 {
  self.minute = struct.minute;
  self.status = struct.status;
  self.formation = struct.formation;
  self.tactic = struct.tactic;
  self.subs = struct.subs;
  return self;
 },
 fromArray: function(arr)
 {
  advtactics = [];
  for (var i = 0; i < arr.length; i++) {
   var temp = { class: "advtactic",
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
    }
   };
   for (var j in this) {
    if (this[j] instanceof Function) {
     temp[j] = this[j];
    }
   }
   advtactics[i] = advtactic.fromStruct(temp, arr[i]);
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
  if (!matches) {
   return [];
  }
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
   ret.push("/edit_tactica.php?id=" + ids[i]);
  }
  return ret;
 },
 getDeleteURLS: function(src) {
  var ids = this.getIds(src);
  var ret = [];
  for (var i = 0; i < ids.length; i++) {
   ret.push("/edit_tactica.php?accion=borrar&id=" + ids[i]);
  }
  return ret;
 },
 getFormValues: function(self, doc) {
  if (!doc) {
   doc = document;
  }
  var frm = doc.forms.frm;
  self.minute = frm.tiempo_juego.value;
  self.status = frm.situacion_partido.value;
  self.formation = frm.formacion.value;
  self.tactic = frm.tactica.value;
  // subs in jugador, out suplente
  self.subs.in[0] = frm.jugador1.value;
  self.subs.in[1] = frm.jugador2.value;
  self.subs.in[2] = frm.jugador3.value;
  self.subs.out[0] = frm.suplente1.value;
  self.subs.out[1] = frm.suplente2.value;
  self.subs.out[2] = frm.suplente3.value;
 },
 getFormData: function() {
  var ret = {};
  for (var i = 0; i < this.formdata.length; i++) {
   ret[this.formtranslate[this.formdata[i]].name] = this[this.formdata[i]];
  }
  ret['accion'] = 'insertar';
  ret['id'] = '';
  if (!this.subs) {
   ret['jugador1'] = "0";
   ret['jugador2'] = "0";
   ret['jugador3'] = "0";
   ret['suplente1'] = "0";
   ret['suplente2'] = "0";
   ret['suplente3'] = "0";
   return ret;
  }
  ret['jugador1'] = this.subs.in[0];
  ret['jugador2'] = this.subs.in[1];
  ret['jugador3'] = this.subs.in[2];
  ret['suplente1'] = this.subs.out[0];
  ret['suplente2'] = this.subs.out[1];
  ret['suplente3'] = this.subs.out[2];
  return ret
 },
 submitForm: function(callback) {
  remote.post("/edit_tactica.php", this.getFormData(), callback);
 },
 getAdvancedTactics: function() {
  self = this;
  advtest = {};
  remote.get("/tactica_avanzada.php", "", function(response) {
   var urls = self.getEditURLS(response);
   storage.getMe(['advtacticcount', urls.length]);
   advtactics = [];
   for (var i = 0; i < urls.length; i++) {
    remote.getHTMLDocument(urls[i], function (doc) {
     var guy = {
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
     };
     for (var i in advtactic) {
      if (advtactic[i] instanceof Function) {
       guy[i] = advtactic[i];
      }
     }
     advtactic.getFormValues(guy, doc);
     if (advtest[guy.minute + " " + guy.status]) return;
     advtest[guy.minute + " " + guy.status] = true;
     advtactics.push(guy);
     storage.getMe('advtactic');
    });
   }
   if (!urls.length) {
    storage.getMe('advtactic');
   }
  });
 },
 setAdvancedTactics: function(callback) {
  self = this;
  remote.get("/tactica_avanzada.php", "", function(response) {
   var durls = self.getDeleteURLS(response);
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
   if (!durls.length) {
    for (var i = 0; i < advtactics.length; i++) {
     advtactics[i].submitForm(counter2);
    }
   }
  });
 }
};
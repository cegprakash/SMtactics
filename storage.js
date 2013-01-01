storage = {
 alltactics: {},
 finished: {},
 callback: null,
 retrievedAdvanced: false,
 getTactics: function(callback)
 {
  this.callback = callback;
  this.retrievedAdvanced = false;
  this.finished = {};
  tactic.getTactics();
  lineup.getLineup();
  shooters.getShooters();
 },
 getAdvancedTactics: function()
 {
  if (this.retrievedAdvanced) return;
  this.retrievedAdvanced = true;
  advtactic.getAdvancedTactics();
 },
 advtacticcount: 0,
 advtacticreceived: 0,
 getMe: function(caller)
 {
  if (caller instanceof Array) {
   this.advtacticcount = caller[1];
   this.finished.countreceived = true;
   return;
  }
  if (caller == 'advtactic') {
   this.advtacticreceived++;
   if (this.advtacticcount != this.advtacticreceived) {
    return;
   }
  } else {
   this.finished[caller] = 1;
   if (this.finished.tactics && this.finished.lineup && this.finished.shooters) {
    this.getAdvancedTactics();
   }
  }
  if (!this.finished.countreceived) {
   return;
  }
  if (this.callback) {
   var adv = [];
   for (var i = 0; i < this.advtacticcount; i++) {
    adv.push(advtactics[i].toStruct());
   }
   var result = {
    'lineup' : lineup.toStruct(),
    'advtactics' : adv,
    'shooters' : shooters.toStruct(),
    'tactics' : tactic,
    'formations' : formations
   };
   this.callback(result);
  }
 },
 removeTactic: function(name, callback) {
  var self = this;
  if (this.alltactics[name]) {
   delete this.alltactics[name];
  }
  chrome.storage.sync.set({'SMTactics': this.alltactics}, callback);
 },
 saveTactics: function(name, callback) {
  var self = this;
  this.getTactics(function(tactic) {
   self.alltactics[name] = tactic;
   chrome.storage.sync.set({'SMTactics': self.alltactics}, function() {
    callback();
   });
  });
 },
 restoreTactic: function(name, callback) {
  if (!this.alltactics[name]) {
   throw new Exception('Unknown tactic set: ' + name);
  }
  var savetactic = this.alltactics[name];
  tactics = savetactic.tactics;
  formations = savetactic.formations;
  advtactic.setFormations(formations);
  advtactic.setTactics(tactics);
  advtactic.fromArr(savetactic.advtactics);
  lineup.fromStruct(savetactic.lineup);
  shooters.fromStruct(savetactic.shooters);
  lineup.setLineup()
 }
}
storage = {
 alltactics: {},
 finished: {},
 callback: null,
 getTactics: function(callback)
 {
  this.finished = {};
  tactics.getTactics();
  formation.getFormations();
  lineup.getLineup();
  shooters.getShooters();
 },
 getAdvancedTactics: function()
 {
  advtactics.getAdvancedTactics();
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
  this.finished[caller] = 1;
  if (this.finished.tactics && this.finished.formations) {
   this.getAdvancedTactics();
  }
  if (!this.finished.countreceived) {
   return;
  }
  if (caller == 'advtactic') {
   this.advtacticreceived++;
  }
  if (this.advtacticcount != this.advtacticreceived) {
   return;
  }
  if (!this.finished.lineup) {
   return;
  }
  if (callback) {
   adv = [];
   for (var i = 0; i < this.advtacticcount; i++) {
    adv.push(advtactics[i].toStruct());
   }
   var result = {
    'lineup' : lineup.toStruct(),
    'advtactics' : adv,
    'shooters' : shooters.toStruct(),
    'tactics' : tactics,
    'formations' : formations
   };
   callback(result);
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
  tactic = this.alltactics[name];
  tactics = tactic.tactics;
  formations = tactic.formations;
  advtactic.setFormations(formations);
  advtactic.setTactics(tactics);
  advtactic.fromArr(tactic.advtactics);
  lineup.fromStruct(tactic.lineup);
  shooters.fromStruct(tactic.shooters);
  lineup.setLineup()
 }
}
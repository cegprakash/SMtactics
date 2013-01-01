storage = {
 alltactics: {},
 finished: {},
 callback: null,
 retrievedAdvanced: false,
 getTactics: function(callback)
 {
  this.callback = callback;
  this.advtacticcount = this.advtacticreceived = 0;
  this.retrievedAdvanced = false;
  this.finished = {};
  tactic.getTactics();
  lineup.getLocalLineup();
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
   if (this.advtacticcount > this.advtacticreceived) {
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
 saveTactics: function(n, callback) {
  var name = n;
  this.getTactics(function(tactic) {
   if (!storage.alltactics) {
    storage.alltactics = {};
   }
   storage.alltactics[name] = tactic;
   chrome.storage.sync.set({'SMTactics': storage.alltactics}, function() {
    callback();
   });
  });
 },
 setAlltactics: function(t) {
  this.alltactics = t;
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
  advtactic.fromArray(savetactic.advtactics);
  lineup.fromStruct(savetactic.lineup);
  shooters.fromStruct(savetactic.shooters);
  var save = [], savefunc = function () {save.push(1); if (save.length >= 3) {callback();}};
  lineup.setLineup(savefunc)
  advtactic.setAdvancedTactics(savefunc);
  shooters.setShooters(savefunc);
 },
 alert: function(text)
 {
  var alerty = document.getElementById('textoalerta');
  var parentthingy = document.getElementById('mensajealerta');
  alerty.innerHTML = text;
  parentthingy.style.display = "inherit";
 },
 click: function(event) {
  var name = prompt("What should we name this saved tactic?", "");
  if (!name) {
   return;
  }
  storage.saveTactics(name, function() {
   storage.alert("Tactic " + name + " saved");
   storage.makeRestoreLink(); // re-construct the list of tactics
  });
 },
 makeRestoreLink: function() {
  var div = document.getElementById("SMTacticsDiv");
  var innerdiv
  if (!div) {
   innerdiv = document.createElement('div');
   innerdiv.id = "smtacticsinner"
   innerdiv.className = "jugadormenuflotante";
   innerdiv.style.display = "none";
   var outera = document.createElement('a');
   outera.className = "boton botonmenujugador";
   outera.appendChild(document.createTextNode("Load Tactic Set"));
   div = document.createElement('div');
   div.className = "menujugador";
   div.appendChild(outera);
   div.appendChild(innerdiv);
   div.style.marginRight = "160px";
  } else {
   innerdiv = document.getElementById('smtacticsinner');
   innerdiv.innerHTML = "";
  }
  div.addEventListener("mouseover", function() {
   innerdiv.style.display = "block";
  });
  div.addEventListener("mouseout", function() {
   innerdiv.style.display = "none";
  });
  var a;
  for (var i in this.alltactics) {
   a = document.createElement('a');
   a.className = "boton";
   a.appendChild(document.createTextNode(i));
   a.href="#";
   a.addEventListener("click", storage.getRestoreFunc(i));
   innerdiv.appendChild(a);
  }
  this.saveLinkDiv.insertAdjacentElement("beforeBegin", div);
 },
 getRestoreFunc: function(name) {
  var tac = name;
  return function() {
   storage.restoreTactic(tac, function() {
    storage.alert("Tactic " + tac + " restored.  Be sure to check the line-up, shooters and tactics to be sure!");
   });
  };
 },
 saveLinkDiv: null,
 makeSaveLink: function() {
  var link = document.getElementsByClassName('container_oro')[0].nextSibling.nextSibling;
  var a = document.createElement('a');
  var outera = document.createElement('a');
  var div = document.createElement('div');
  var innerdiv = document.createElement('div');
  this.saveLinkDiv = div;
  outera.className = "boton botonmenujugador";
  outera.appendChild(document.createTextNode("Save Tactic Set"));
  div.className = "menujugador";
  div.addEventListener("mouseover", function() {
   innerdiv.style.display = "block";
  });
  div.addEventListener("mouseout", function() {
   innerdiv.style.display = "none";
  });
  innerdiv.className = "jugadormenuflotante";
  a.className = "boton";
  a.appendChild(document.createTextNode("Save New"));
  a.href="#";
  a.addEventListener("click", storage.click);
  innerdiv.style.display = "none";
  innerdiv.appendChild(a);
  div.appendChild(outera);
  div.appendChild(innerdiv);
  link.insertAdjacentElement("beforeBegin", div);
 }
}
chrome.storage.sync.get(['SMTactics'], function(a) {
 if (a['SMTactics']) {
  storage.setAlltactics(a['SMTactics']);
 }
 storage.makeRestoreLink();
});
storage.makeSaveLink();
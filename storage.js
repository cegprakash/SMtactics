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
 saveTactics: function(n, c) {
  var name = n, callback = c;
  this.getTactics(function(tactic) {
   if (!storage.alltactics) {
    storage.alltactics = {};
   }
   tactic.name = name;
   this.saveTacticInStorage(tactic, callback);
  });
 },
 addTacticSet: function(t, s) {
  this.alltactics[t] = s;
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
  var innerdiv;
  if (!div) {
   innerdiv = document.createElement('div');
   innerdiv.id = "smtacticsinner"
   innerdiv.className = "jugadormenuflotante";
   innerdiv.style.display = "none";
   var outera = document.createElement('a');
   outera.className = "boton botonmenujugador";
   outera.appendChild(document.createTextNode("Load Tactic Set"));
   div = document.createElement('div');
   div.id = "SMTacticsDiv";
   div.className = "menujugador";
   div.style.position = "absolute";
   div.style.left = "160px";
   div.appendChild(outera);
   div.appendChild(innerdiv);
   div.style.marginRight = "160px";
   div.style.zIndex = 99;
   div.addEventListener("mouseover", function() {
    innerdiv.style.display = "block";
   });
   div.addEventListener("mouseout", function() {
    innerdiv.style.display = "none";
   });
  } else {
   innerdiv = document.getElementById('smtacticsinner');
   innerdiv.innerHTML = "";
  }
  var a, top = 0;
  for (var i in this.alltactics) {
   a = document.createElement('a');
   a.className = "boton";
   a.style.position = "absolute";
   a.appendChild(document.createTextNode(i));
   a.href="#";
   if (top) {
    a.style.top = String(top) + "px";
   }
   top += 23;
   a.addEventListener("click", storage.getRestoreFunc(i));
   innerdiv.appendChild(a);
  }
  div.style.height = String(top) + "px";
  this.saveLinkDiv.insertAdjacentElement("afterEnd", div);
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
 tacticNames: [],
 setTacticnames: function(a)
 {
  if (!a) a = [];
  this.tacticNames = a;
 },
 getSetName: function(i)
 {
  return "SMTactics.tactic" + String(i);
 },
 getNextSetName: function()
 {
  return this.getSetName(this.tacticNames.length + 1);
 },
 getSaveTacticStruct: function(tactic) {
  return {
   name: tactic.name,
   tactic: tactic
  };
 },
 saveTacticInStorage: function(tactic, callback) {
  var struct = this.getSaveTacticStruct(tactic);
  var name;
  if (this.alltactics[tactic.name]) {
    name = tactic.setname;
  } else {
    name = this.getNextSetName();
    this.tacticNames.push(name);
    tactic.setname = name;
  }
  this.alltactics[tactic.name] = tactic;
  var set = {'SMTactics.sets': this.tacticNames}
  for (var i in this.alltactics) {
   set[this.alltactics[i].setname] = this.alltactics[i];
  }
  console.log(JSON.stringify(set));
  chrome.storage.sync.set(set, callback);
  this.makeRestoreLink();
 },
 makeSaveLink: function() {
  var link = document.getElementsByClassName('botonesright')[0].firstChild.nextSibling;
  var a = document.createElement('a');
  var outera = document.createElement('a');
  var div = document.createElement('div');
  var innerdiv = document.createElement('div');
  this.saveLinkDiv = div;
  outera.className = "boton botonmenujugador";
  outera.appendChild(document.createTextNode("Save Tactic Set"));
  div.className = "menujugador";
  div.style.left = "0px";
  div.style.position = "absolute";
  div.addEventListener("mouseover", function() {
   innerdiv.style.display = "block";
  });
  div.addEventListener("mouseout", function() {
   innerdiv.style.display = "none";
  });
  innerdiv.className = "jugadormenuflotante";
  a.className = "boton";
  a.style.left = "0px";
  a.style.position = "absolute";
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
chrome.storage.sync.get(['SMTactics.sets'], function(a) {
 if (a['SMTactics.sets']) {
  storage.setTacticnames(a['SMTactics.sets']);
  var sets = a['SMTactics.sets']
  chrome.storage.sync.get(sets, function (b) {
    for (var i = 0; i < sets.length; i++) {
      storage.addTacticSet(b[sets[i]].name, b[sets[i]]);
    }
    storage.makeRestoreLink();
  });
 }
});
storage.makeSaveLink();
var lineup = {
 class: "lineup",
 formation: "",
 formations: {},
 starters: [],
 subs: [],
 reserves: [],
 parseFormations: function(src)
 {
  if (!src) {
   src = document.getElementsByClassName('bframe')[0].innerHTML;
  }
  var formationsregex = "<a href=\"javascript:selectFormacion\\(([0-9]+)\\);\">([^<]+)<";
  var matches = src.match(new RegExp(formationsregex, "g"));
  if (matches) {
   for (var i = 0; i < matches.length; i++) {
    var info = matches[i].match(new RegExp(formationsregex));
    this.formations[info[2]] = info[1];
   }
  }
  this.formation = this.formations[src.match(/<div id="formactual">([^<]+)</)[1]];
 },
 fromStruct: function(struc)
 {
  for (var i in struct) {
   this.i = struct[i];
  }
 },
 toStruct: function()
 {
  return {
   class: "lineup",
   formation: this.formation,
   formations: this.formations,
   starters: this.starters,
   subs: this.subs,
   reserves: this.reserves
  };
 },
 getSaveURL: function()
 {
  var info = [];
  for (var i = 0; i < this.starters.length; i++) {
   info[this.starters[i].index - 1] = this.starters[i].id;
  }
  return 'http://en3.strikermanager.com/save_alineacion.php?formacion='+this.formation+'&posiciones='+info.join(',')+"&pag=1&juvenil=0";
 },
 parseLineup: function(src)
 {
  if (!src) {
   src = document.getElementsByClassName('bframe')[0].innerHTML;
  }
  // 1 - position index
  // 2 - position name
  var positionregex = "posiciones\\[([0-9]+)\\] = {\\s+posx: [0-9]+,\\s+posy: [0-9]+,\\s+demarcacion: [0-9]+,\\s+nombre: '([A-Z]+)'";
  var positions = {};
  // 1 - id
  // 2 - name
  // 3 - position index
  // 4 - average
  // 5 - index
  var playerregex = "fila.id_jugador = '([0-9]+)';\\s+" +
		"fila.nombre = '([^']+)';\\s+" +
		"fila.posicion = ([0-9]+);\\s+" +
		"fila.dorsal = [0-9]+;\\s+" +
		"fila.media_mental = [0-9]+;\\s+" + 
		"fila.media_fisica = [0-9]+;\\s+" +
		"fila.media_defensa = [0-9]+;\\s+" +
		"fila.media_ataque = [0-9]+;\\s+" +
		"fila.media_total = ([0-9]+);\\s+" +
		"fila.moral = [0-9]+;\\s+" +
		"fila.energia = [0-9]+;\\s+" +
		"fila.ind = ([0-9]+);"
  var positionmatches = src.match(new RegExp(positionregex, "g"));
  if (!positionmatches) {
   return;
  }
  for (var i = 0; i < positionmatches.length; i++) {
   var info = positionmatches[i].match(new RegExp(positionregex));
   positions[info[1]] = info[2];
  }
  var globalsearch = new RegExp(playerregex, "g");
  var localsearch = new RegExp(playerregex);
  var matches = src.match(globalsearch);
  if (matches) {
   for (var i = 0; i < matches.length; i++) {
    var info = matches[i].match(localsearch);
    var cur = player.create(info[1], info[2], positions[info[3]], info[4], info[5]);
    if (i < 12) {
     this.starters.push(cur);
    } else if (i < 18) {
     this.subs.push(cur);
    } else {
     this.reserves.push(cur);
    }
   }
  }
 },
 getLineup: function()
 {
  self = this;
  remote.get("http://en3.strikermanager.com/alineacion.php", "", function(response) {
   self.parseFormations(response);
   self.parseLineup(response);
   storage.getMe('lineup');
  });
 },
 setLineup: function(callback)
 {
  remote.get(this.getSaveURL(), "", callback);
 }
}
var player = {
 class: "player",
 id: 0,
 name: "",
 position: "",
 index: 0,
 average: "",
 create: function (id, name, position, average, index)
 {
  return {
   class: "player",
   id: id ? id : "",
   name: name ? name : "",
   position: position ? position : "",
   average: average ? average : "",
   index: index ? index: 0
  };
 }
}
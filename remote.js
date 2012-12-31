var remote = {
 encode: function(arr)
 {
  var ret = {};
  for (var i in arr) {
   ret[i] = encodeURIComponent(arr[i]);
  }
  return ret.join("&");
 },
 prepare: function(url, body, callback)
 {
  if (!body.substring) body = this.encode(body);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(response) {
   if (xhr.readyState == 4 && xhr.status == 200) {
    if (callback) {
     callback(xhr.responseText);
    }
   }
  };
  return [xhr, body];
 },
 post: function(url, body, callback)
 {
  var res = this.prepare(url, body, callback);
  var xhr = res[0];
  body = res[1];
  xhr.open(url, "post");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
 },
 get: function(url, params, callback)
 {
  var res = this.prepare(url, body, callback);
  var xhr = res[0];
  body = res[1];
  xhr.open(url + "?" + body, "get");
  xhr.send();
 },
 getHTMLDocument: function(url, callback)
 {
  var res = this.prepare(url, "", this.makeDocument(callback));
  var xhr = res[0];
  xhr.open(url, "get");
  xhr.send();
 },
 makeDocument: function(callback)
 {
  return function(response) {
   var doc = document.implementation.createHTMLDocument("stuff");
   doc.documentElement.innerHTML = response;
   if (callback) {
    callback(doc);
   }
  }
 }
}
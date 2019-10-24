function expDate() {
  var today = new Date();
  today.setDate(today.getDate() + 2);
  var mm, dd, yyyy;
  mm = today.getMonth() + 1;
  dd = today.getDate();
  yyyy = today.getFullYear();
  document.getElementById('TPexpire').innerHTML = mm + "/" + dd + "/" + yyyy;
}

expDate();
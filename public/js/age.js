function setAge(el) {
  el.innerHTML = (
    (Date.now() - 1180879200000) /
    1000 /
    60 /
    60 /
    24 /
    365.25
  ).toFixed(4);
}

document.addEventListener("DOMContentLoaded", function () {
  const span = document.getElementById("age");
  setAge(span);
});

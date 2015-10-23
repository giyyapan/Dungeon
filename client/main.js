(function() {
  var DungeonClient;

  DungeonClient = (function() {
    function DungeonClient() {
      console.log("inited");
      $("#drag-section").on("mouseup", function() {
        return alert("mouse up");
      });
    }

    return DungeonClient;

  })();

  document.onload = function() {
    return new DungeonClient;
  };

}).call(this);

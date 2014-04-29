/* Code gen trans-imports this from Robot.ksb */
// Should be hoisted.
var Robot = function (id_number, name, model_number) {
  var Robot = {};
  var _hidden = {};
    _hidden.id = id_number.substring(3);
    _hidden.name = undefined;
    _hidden.model_no = undefined;
    _hidden.hp = 100;
    _hidden.mana = 80;
  
  Robot.regen = function () {
    _hidden.hp++;
  };

  Robot.login = function () {
    return _hidden.id === "3000";
  };

  Robot.get = {
    name: function () {
      return _hidden.name;
    },
    model_no: function () {
      return _hidden.model_no ;
    }
  };

  Robot.set = {
    mana: function (new_mana) {
      _hidden.mana = new_mana;
    },
    newID: function () {
      _hidden.id = "3000";
      this.set.mana(75);
    }
  };

  return Robot;
}

var robot = new Robot(undefined, "Miles", undefined);


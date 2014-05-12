/* Code gen trans-imports this from Robot.ksb */
// Should be hoisted.
var Robot = function (id_number, name, model_number) {
  var Robot = {};
  var id = id_number,
      name = undefined,
      model_no = undefined,
      hp = 100,
      mana = 80;
  
  Robot.regen = function () {
    hp++;
  };

  Robot.login = function () {
    return id === "3000";
  };

  Robot.get = {
    name: function () {
      return name;
    },
    model_no: function () {
      return model_no ;
    }
  };

  Robot.set = {
    mana: function (new_mana) {
      mana = new_mana;
    },
    newID: function () {
      id = "3000";
      Robot.set.mana(75);
    }
  };

  return Robot;
}

/**
 * var robot = new Robot(undefined, "Miles", undefined);
 */

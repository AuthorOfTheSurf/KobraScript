$ goLeft = true
.. directions = []


only:
  directions['push']('went left') .. if (goLeft) else:
  directions['push']('went right') ..

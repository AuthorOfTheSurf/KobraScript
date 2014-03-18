$ move = fn():
    return "derp" == "herp"
end

$ moveit = proc():
    return move()
end

$ move2 = move()
$ move3 = move

move2 :=: move3
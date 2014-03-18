$ bicycle = {
    frame: "aluminum",
    year: 2009,
    gears: 10,
    speed: 12.7,
    carbonFiber: true,
    extraParts: ['speedometer', 'light'],
    
    move: proc ():
        Transform.translate(FORWARD * this.speed)
    end,
    upgrade_speed: fn ():
        return this.speed * 1.1
    end,
    get_frame: fn (): return this.frame end
}
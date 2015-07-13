$ circle = {
  radius: 4,
  area: fn():
    return Math.PI * Math.pow(this.radius, 2)
  ..,
  circumference: fn():
    return 2 * Math.PI * this.radius
  ..
}

say circle.area()
say circle.circumference()

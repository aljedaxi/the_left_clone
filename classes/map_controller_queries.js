/**
  @param {number} x
  @param {number} y
  @class
  */
function Coords(x, y) {
  return {
    x,
    y,
  };
}

/**
  @param {Coords} center
  @param {number} radius -- the distance from the center
  @class
  */
function Circle(center, radius) {
  return {
    center,
    radius,
  };
}

const SpaceQuery = Circle;

/**
  * defines the temporal range of events we want
  @param {DateTime} from
  @param {DateTime} to
  @class
  */
function TimeQuery(from, to) {
  return {
    from,
    to,
  };
}

//TODO Categorizational query

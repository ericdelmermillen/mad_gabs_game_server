
// getPoints for when user gets question correct

const getPoints = (secondsRemaining) => {
  return secondsRemaining > 60 
          ? 100
          : Math.round(100 - 100 / 60 * (60 - secondsRemaining)); 
}

console.log(getPoints(6))



// check if 24 hours have elapsed since previous timestamp

const has24HoursElapsed = (timestamp) => {
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  return Date.now() - timestamp >= twentyFourHoursInMilliseconds;
}

console.log(has24HoursElapsed(1692823914592));  
     




module.exports = {
  getPoints, 
  has24HoursElapsed
}
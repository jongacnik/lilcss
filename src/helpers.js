function matchesArr (str, regExp) {
  let matchedArr = []
  let match
  while ((match = regExp.exec(str)) !== null) {
    matchedArr.push(match.slice(1))
  }
  return matchedArr
}

function flatten (a, b) {
  a = a || []
  return a.concat(b)
}

function uniq (a) {
  return Array.from(new Set(a))
}

module.exports = {
  matchesArr: matchesArr,
  flatten: flatten,
  uniq: uniq
}

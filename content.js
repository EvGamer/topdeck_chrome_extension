function codeToChar(match, grp) {
  return String.fromCharCode(parseInt(grp, 16));
}

function unescapeUnicode(rawStr) {
  var unicodeEscapes = new RegExp('\\\\?u([\d\w]{4})', 'gi');
  var result = rawStr.replace(unicodeEscapes, codeToChar);
  result = decodeURIComponent(result);
  return result;
}

function retrieveCards(rawData) {
  var cardAssignmentFinder = new RegExp('var singles = JSON.parse\(\'(.*?)\'\)', 'gm');
  var match = cardAssignmentFinder.exec(rawData);
  if (!match) return [];
  try{
    //var result = parse()
    var result = JSON.parse(unescapeUnicode(match[1]));
    return result.map(function (card) {
      card.url = card.url.replace(new RegExp('\\\/', 'g'), '/');
      card.url = card.url.replace(new RegExp('\\\\', 'g'), '\\');
      return card;
    });
  } catch(error) {
    console.error(error);
    return [];
  }
}

function displayCard(card) {
  var city = card.seller.city || card.city;
  var seller = card.seller.name || card.seller;
  console.log(card.cost + ' р ' + card.name + ' ' + seller + ' ' + city);
}

fetch(
  'https://topdeck.ru/apps/toptrade/singles/search?q=Plains',
  { method: 'GET', mode: 'cors' }
)
  .then(function (response) {
    console.log(response);
    return response.text();
  })
  .then(function (data) {
    console.log(data);
    var cardList = retrieveCards(data);
    if(!cardList.length) console.log('No cards found');
    cardList.forEach(displayCard)
  })
  .catch(function(error) {
    console.log(error);
  });
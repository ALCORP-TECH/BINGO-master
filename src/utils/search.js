export function searchingData(search) {
  return function (x) {
    return (
      x.name.toLowerCase().includes(search) ||
      x.name.toUpperCase().includes(search) ||
      x.lastName.toLowerCase().includes(search) ||
      x.lastName.toUpperCase().includes(search) ||
      x.email.toLowerCase().includes(search) ||
      x.email.toUpperCase().includes(search) ||
      !search
    );
  };
}

export function searchingBusinessData(search) {
  return function (x) {
    return x.name.toLowerCase().includes(search) || x.name.toUpperCase().includes(search) || !search;
  };
}

export function searchingCard(search) {
  return function (x) {
    return x.num.toLowerCase().includes(search) || x.num.toUpperCase().includes(search) || !search;
  };
}

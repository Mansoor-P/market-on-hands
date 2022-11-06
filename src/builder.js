const Builder = {};
Builder.Commodity = (record) => ({
  name: record.commodity,
  arrival_date: record.arrival_date,
  min_price: record.min_price,
  max_price: record.max_price,
  modal_price: record.modal_price,
  variety: record.variety,
});

Builder.Market = (record) => ({
  name: record.market,
  commodities: [Builder.Commodity(record)],
});

Builder.District = (record) => ({
  name: record.district,
  markets: [Builder.Market(record)],
});

Builder.State = (record) => ({
  name: record.state,
  districts: [Builder.District(record)],
});

Builder.load = (host, record) => {
  for (state of host) {
    if (state.name == record.state) {
      for (district of state.districts) {
        if (district.name == record.district) {
          for (market of district.markets) {
            if (market.name == record.market) {
              market.commodities.push(Builder.Commodity(record));
              return;
            }
          }
          district.markets.push(Builder.Market(record));
          return;
        }
      }
      state.districts.push(Builder.District(record));
      return;
    }
  }
  host.push(Builder.State(record));
  return;
};

Builder.FromToday = (dateString) => {
  console.log(dateString);
  const today = new Date();
  const to = dateString.split("/").map((d) => Number(d));
  const target = new Date(`${to[2]}-${to[1]}-${to[0]}`);
  var diffDays = parseInt((today - target) / (1000 * 60 * 60 * 24), 10); 
  console.log(diffDays);
  switch (diffDays) {
    case 0:
      return "Today";
    case 1:
      return "Yesturday";
    case 7:
      return "One week ago";
    default:
      return dateString;
  }
};
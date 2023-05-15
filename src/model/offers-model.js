export default class OfferModel {
  constructor(service){
    this.service = service;
    this.offers = this.service.offers;
  }

  get(){
    return this.offers;
  }

  getByType(type){
    return this.offers.find((offer) => offer.type === type).offers;
  }

  getByIds(offersByType, ids){
    return [...offersByType.filter((offer) => ids.find((id) => offer.id === id))];
  }
}

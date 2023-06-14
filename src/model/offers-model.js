export default class OfferModel {
  #offers = null;
  #service = null;

  constructor(service){
    this.#service = service;
  }

  async init(){
    this.#offers = await this.#service.offers;
    return this.#offers;
  }

  get offers(){
    return this.#offers;
  }

  getByType(type){
    return this.#offers.find((offer) => offer.type === type).offers;
  }

  getByIds(offersByType, ids){
    return [...offersByType.filter((offer) => ids.find((id) => offer.id === id))];
  }
}

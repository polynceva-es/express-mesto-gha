const cardsRouter = require('express').Router();
const {
  getCards,
  postCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', postCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', putCardLike);
cardsRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardsRouter;

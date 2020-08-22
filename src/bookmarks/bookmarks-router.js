'use strict';
const express = require('express');
const logger = require('../logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const {v4: uuid} = require('uuid');
const bookmarks = require('../store');

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const {title, description, url, rating} = req.body;
    if(!title){
      logger.error(`Bookmark title is required`);
      res.status(400).send('Invalid data');
    }
    if(!description){
      logger.error(`Bookmark description is required`);
      res.status(400).send('Invalid data');
    }
    if(!url){
      logger.error(`Bookmark link is required`);
      res.status(400).send('Invalid data');
    }
    if(!rating){
      logger.error(`Rate your bookmark`);
      res.status(400).send('Invalid data');
    }
    const id = uuid();
    const bookmark = {
      id,
      title,
      description,
      url,
      rating
    };
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });
bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const {id} = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);
    if(!bookmark){
      logger.error(`Bookmarks with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark not found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
    if(bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark not found');
    }
    bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${id} deleted`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter;

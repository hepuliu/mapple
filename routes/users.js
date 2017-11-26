//jl user routes
"use strict";

const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = (knex) => {

    // get list of users
    router.get('/', (req, res) => {
      res.redirect('/maps/');
        // let users = knex.select().from('users');
        // users.then((result)=>{
        //     res.json(result);
        // }).catch((err)=>{
        //     res.status(500).send(err);
        // });
    });

    // renders user profile
    router.get('/:user_id', (req, res) => {
        // TODO: check for authorization
        let templateVars = {
          user: req.session.user_id
        };
        res.render('index', templateVars);
    });

    // renders user profile

    let getUserFavorites = (user_id) => {
      knex
        .select("maps.*", "fav_count_table.fav_count")
        .from("maps")
        .leftOuterJoin("favorites", "favorites.fav_map_id", "maps.map_id")
        .leftOuterJoin(
          function () {
            this
              .select("favorites.fav_map_id")
              .count("favorites.fav_user_id as fav_count")
              .from("favorites")
              .groupBy("favorites.fav_map_id")
              .as("fav_count_table")
            },
            "fav_count_table.fav_map_id", "maps.map_id")
        .where("favorites.fav_user_id", user_id)
        .orderBy("fav_count", "desc")
        .then( (result) => {
          res.json(result)
        })
        .catch( (err) => {
          res.status(400).send('Error happened, user maps cannot be loaded');
        })
    }


    // let getUserContributions = (user_id) => {
    //   knex
    //     .select("maps.*")
    //     .max("fav_count_table.fav_count as fav_count")
    //     .from("maps")
    //     .leftOuterJoin("pins", "maps.map_id", "pins.pin_map_id")
    //     .leftOuterJoin(
    //       function () {
    //         this
    //           .select("favorites.fav_map_id")
    //           .count("favorites.fav_user_id as fav_count")
    //           .from("favorites")
    //           .groupBy("favorites.fav_map_id")
    //           .as("fav_count_table")
    //         },
    //         "fav_count_table.fav_map_id", "maps.map_id")
    //     .where("maps.map_user_id", user_id)
    //     .orWhere("pins.pin_user_id", user_id)
    //     .groupBy("maps.map_id")
    //     .then( (result) => {
    //       // res.json(result)
    //       console.log('cont', result)
    //     })
    //     .catch( (err) => {
    //       res.status(400).send('Error happened, user maps cannot be loaded');
    //     })
    // }

    // router.get('/contributions', (req, res) => {
    //   getUserContributions(req.session.user_id);
    // });

    // create user
    // TODO: needs to hash password
    router.post('/', (req, res) => {
        // use body-parser to insert into db
        let user = {
            user_id: req.body.id,
            user_username: req.body.username,
            user_password: req.body.password,
            user_email: req.body.email,
        }
        // TODO: validate if insert was successful
        knex.insert(user).into('users');
        res.render("OK");
    });

    // // update user
    // router.put('/:user_id', (req, res) => {
    //     // TODO
    // });

    // // delete user
    // router.delete("/:user_id", (req, res) => {
    //     // TODO: check for authorization
    //     // TODO: check for db errors
    //     knex('users').where('user_id', req.params.user_id).del();
    // });

    return router;

}

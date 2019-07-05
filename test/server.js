// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { newEnforcer } = require('casbin')
const express = require('express')
const authz = require('../authz')

const app = express()

// response
app.use((req, res, next) => {
  req.locals = req.locals || {}
  const username = req.get('Authorization') || 'anonymous'
  req.locals.currentUser = {username}
  req.locals.authenticated = !!username
  next()
})

// use authz middleware
app.use(authz(async () => {
  // load the casbin model and policy from files, database is also supported.
  const enforcer = await newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv')
  return enforcer
}))

// response
app.use((req, res, next) => {
  res.status(200).json({200: 'OK'})
})

module.exports = app

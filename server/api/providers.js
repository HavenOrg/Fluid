const router = require('express').Router()
const {Provider} = require('../db/models')
module.exports = router

router.get('/providers', async (req, res, next) => {
  try {
    const providers = await Provider.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'title', 'email']
    })
    res.json(providers)
  } catch (err) {
    res.status(404)
    next(err)
  }
})

router.get('/providers/:id', async (req, res, next) => {
  try {
    const provider = await Provider.findOne({
      id: req.params.id
    })
    res.json(provider)
  } catch (err) {
    res.status(404)
    next(err)
  }
})

router.patch('providers/:id', async (req, res, next) => {
  try {
    const provider = await Provider.findOne({id: req.params.id})
    if (req.body.title) {
      provider.title = req.body.title
    }
    await provider.save()
    res.json(provider)
  } catch (err) {
    next(err)
  }
})

router.delete('/providers/:id', async (req, res, next) => {
  try {
    await Provider.deleteOne({id: req.params.id})
    res.status(204).send()
  } catch (err) {
    res.status(404)
    res.send({err: 'This healthcare provider does not exist!'})
    next(err)
  }
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1713133919")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2319118872",
    "max": 10,
    "min": 1,
    "name": "calificacion",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1713133919")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2319118872",
    "max": null,
    "min": null,
    "name": "calificacion",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})

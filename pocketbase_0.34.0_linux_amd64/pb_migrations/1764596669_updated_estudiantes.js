/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1134758933")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select3113174826",
    "maxSelect": 1,
    "name": "grado",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1ºA",
      "1ºB",
      "2ºA",
      "2ºB"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1134758933")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select3113174826",
    "maxSelect": 1,
    "name": "grado",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1ºA",
      "1ºB",
      "1ºC",
      "2ºA"
    ]
  }))

  return app.save(collection)
})

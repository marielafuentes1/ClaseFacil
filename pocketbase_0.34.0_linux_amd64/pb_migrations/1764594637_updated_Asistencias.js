/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4273126015")

  // update collection data
  unmarshal({
    "name": "asistencias"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4273126015")

  // update collection data
  unmarshal({
    "name": "Asistencias"
  }, collection)

  return app.save(collection)
})

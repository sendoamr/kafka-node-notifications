FROM mongo

COPY events_types.json /events_types.json
CMD mongoimport --host mongodb --db reach-engine --collection EventTypes --type json --file /events_types.json --jsonArray
###parsed.json file structure###

Individual JSON structure
```
{
  "avg_bid" : FLOAT,
  "high_bid" : FLOAT,
  "timestamp" : LONG
}
```

Overall file structure
```
{
  "app" : {
    "banner" : [...],
    "video" : [...]
  },
  "desktop" : {
    "banner" : [...],
    "video" : [...]
  },
  "mobile" : {
    "banner" : [...],
    "video" : [...]
  }
}
```

This file contains arrays of all the JSON objects.

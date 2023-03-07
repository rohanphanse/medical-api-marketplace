# API Methods

## Correlation
```py
# Find the correlation between a person's age and their cholesterol level
correlate cholesterol_level age all
```

## Average
```py
# Finds the average duration of symptoms for people who had COVID 
average covid_symptoms_duration all
```

## Min
```py
# Find the minimum height of all people
min height all
```

## Max
```py
# Finds the maximum cholesterol level of people between the ages of 20 and 30
max cholesterol_level (filter (and (greater_than age 20) (less_than age 30)) all)
```

## Count
```py
# Count the number of people with a cholesterol level greater than 300
count (filter (greater_than cholesterol_level 300) all)
count all
```

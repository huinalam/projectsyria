library(tidyr)
library(dplyr)

co_occurrence = read.csv("event_type_group.csv")

co_occurrence$group_by_event <- paste(co_occurrence$event,co_occurrence$group)
group_by_event = group_by(co_occurrence, group_by_event)

co_occurrence_group_by_event = summarise(group_by_event, value = sum(value))

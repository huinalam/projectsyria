install.packages(c("dplyr", "hflights"));
library(dplyr);
library(hflights);

ref_month <-read.csv("chart_monthly.csv");

ref_month_sum <-aggregate(ref_month$num, by=list(ref_month$date), FUN=sum);

write.csv(ref_month_sum,"ref_month_sum.csv")


event_whole <-read.csv("event_type_group.csv")
event_summary <-aggregate(event_whole$value, by=list(c[event_whole$event,event_whole$group]),FUN=sum);
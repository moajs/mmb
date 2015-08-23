#! /bin/bash
#  ./export.sh 20150823
echo $@
mkdir $@

nohup mongoexport -d xbm-wechat-api -c activities -o $@/activities.csv  -h 127.0.0.1 >> $@.log
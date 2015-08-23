#! /bin/bash
#  ./export.sh 20150823
echo $@
mkdir $@


{{#each collection_names}}
nohup mongoexport -d {{../config.db}} -c {{this}} -o $@/{{this}}.csv  --host {{../config.host}} --port {{../config.port}} >> $@.log
{{/each}}
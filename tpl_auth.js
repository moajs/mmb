#! /bin/bash
#  ./export.sh 20150823
echo $@
mkdir $@

{{#each collection_names}}
nohup mongoexport -d {{../config.db}} -c {{this}} -o $@/{{this}}.json  --host {{../config.host}} --port {{../config.port}} -u {{../config.username}} -p {{../config.password}} >> $@.log
{{/each}}
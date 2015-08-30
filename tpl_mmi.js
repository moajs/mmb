#! /bin/bash
#  ./import.sh 20150828
echo $@

{{#each collection_names}}
nohup mongoimport --drop -d {{../config.db}} -c {{this}}  --host {{../config.host}} --port {{../config.port}} $@/{{this}}.json>> $@_imoport.log
{{/each}}

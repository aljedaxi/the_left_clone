files=`find ./ | grep .js\$ | grep -v node_modules`
jsdoc $files

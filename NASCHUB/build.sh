#!/bin/sh
# NascHUB — build do single-file (ordem importa: boot no fim do part7; part10 antes dele)
cd "$(dirname "$0")"
NODE=${NODE:-node}
{ head -c 0; } >/dev/null
python3 - <<'PY'
b0=open('part0.html',encoding='utf-8').read()
css=open('part6.css',encoding='utf-8').read()
b0=b0.replace('</style>',css+'</style>',1)
head=b0[:b0.index('<script>')+len('<script>')]
js=''.join(open(n,encoding='utf-8').read() for n in
  ['part1.js','part2.js','part3.js','part4.js','part5.js','part10.js','part7.js','part8.js','part9.js'])
open('index.html','w',encoding='utf-8').write(head+"\n'use strict';\n"+js+"\n</script>\n</body>\n</html>\n")
PY
"$NODE" --check <(sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d') && echo "build ok → index.html"

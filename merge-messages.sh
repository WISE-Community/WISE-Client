TRANSUNITS=$(xml_grep --pretty_print indented --nowrap --cond "trans-unit" src/messages.xlf src/messages-code.xlf)
START='<?xml version="1.0" encoding="UTF-8"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2"><file source-language="en-US" datatype="plaintext" original="ng2.template"><body>'
END='</body></file></xliff>'
echo $START$TRANSUNITS$END > src/combined.xlf
xmllint --format src/combined.xlf > src/messages.xlf
rm src/combined.xlf
